import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { Document, Model } from 'mongoose';
import { EventMetadata } from 'src/models/abstract/event-metadata.abstract';
import { ChannelOpened } from 'src/models/channel-opened.model';
import { EventDataExtended } from 'src/models/common/event-data-extended.common';
import { ChannelClosedDto } from 'src/models/dto/channel-closed.dto';
import { ChannelNewDepositDto } from 'src/models/dto/channel-new-deposit.dto';
import { ChannelSettledDto } from 'src/models/dto/channel-settled.dto';
import { ChannelWithdrawDto } from 'src/models/dto/channel-withdraw.dto';
import { NonClosingBalanceProofUpdatedDto } from 'src/models/dto/non-closing-balance-proof-updated.dto';
import Web3 from 'web3';
import { Contract, EventData } from 'web3-eth-contract';
import { ChannelClosed } from 'src/models/channel-closed.model';
import { ChannelNewDeposit } from 'src/models/channel-new-deposit.model';
import { ChannelSettled } from 'src/models/channel-settled.model';
import { ChannelWithdraw } from 'src/models/channel-withdraw.model';
import { NonClosingBalanceProofUpdated } from 'src/models/non-closing-balance-proof-updated.model';
import { ChannelOpenedDto } from 'src/models/dto/channel-opened.dto';
import { TokenNetworkOverview } from 'src/models/token-network-overview.model';
import { ChannelEventToFieldMap } from 'src/models/common/channel-event-to-field-map.common';

@Injectable()
export class EventsScannerService {
    private overviewDate: string = ''
    private tokenNetworkOverview: { [id: string]: TokenNetworkOverview } = {}

    constructor(
        @Inject('web3') private readonly web3: Web3,
        @InjectModel(ChannelClosed.name) private readonly channelClosedModel: Model<ChannelClosed>,
        @InjectModel(ChannelNewDeposit.name) private readonly channelNewDepositModel: Model<ChannelNewDeposit>,
        @InjectModel(ChannelOpened.name) private readonly channelOpenedModel: Model<ChannelOpened>,
        @InjectModel(ChannelSettled.name) private readonly channelSettledModel: Model<ChannelSettled>,
        @InjectModel(ChannelWithdraw.name) private readonly channelWithdrawModel: Model<ChannelWithdraw>,
        @InjectModel(NonClosingBalanceProofUpdated.name) private readonly nonClosingBalanceProofUpdatedModel: Model<NonClosingBalanceProofUpdated>,
        @InjectModel(TokenNetworkOverview.name) private readonly tokenNetworkOverviewModel: Model<TokenNetworkOverview>,
    ) { }

    async getEvents(contract: Contract, fromBlock: number | string, toBlock: number | string): Promise<EventDataExtended[]> {
        const eventsData: EventData[] = await contract.getPastEvents('AllEvents', { fromBlock: fromBlock, toBlock: toBlock })
        const eventsDataExt: EventDataExtended[] = await Promise.all(eventsData.map(async (event: EventData) => {
            return { ...event, blockTimestamp: parseInt(((await this.web3.eth.getBlock(event.blockNumber)).timestamp).toString() + '000') }
        }))
        Logger.debug(`${this.getEvents.name}: ${contract.options.address} . From ${fromBlock} to ${toBlock}`)
        return eventsDataExt
    }

    async getAllEvents(contract: Contract): Promise<EventDataExtended[]> {
        const eventsData: EventData[] = await contract.getPastEvents('AllEvents', { fromBlock: 10000000, toBlock: 'latest' })
        const eventsDataExt: EventDataExtended[] = await Promise.all(eventsData.map(async (event: EventData) => {
            return { ...event, blockTimestamp: parseInt(((await this.web3.eth.getBlock(event.blockNumber)).timestamp).toString() + '000') }
        }))
        Logger.debug(`${this.getAllEvents.name}: ${contract.options.address}`)
        return eventsDataExt
    }

    async scanSmartContractEvents(contract: Contract) {
        let blockNumber: number = 10000000 //TODO save lastblock on DB, use it here
        setInterval(async () => {
            let lastBlock = await this.web3.eth.getBlockNumber()
            if (lastBlock > blockNumber) {
                Logger.debug(`Check for new events on contract: ${contract.options.address}. From ${blockNumber} to ${lastBlock}`)
                this.getAndSaveNewEvents(contract, blockNumber, lastBlock)
                blockNumber = lastBlock
            }
        }, 10000)

    }

    async getAndSaveNewEvents(contract: Contract, fromBlock: number | string, toBlock: number | string) {
        const eventsDataExt: EventDataExtended[] = await this.getEvents(contract, fromBlock, toBlock)
        let events: EventMetadata[] = await Promise.all(eventsDataExt.map(async (event: EventDataExtended) => await this.saveEvent(event, contract.options.address)))
        Logger.debug(`Getted and saved if not present ${events.length} events from contract: ${contract.options.address}. From ${fromBlock} to ${toBlock}`)
        return events
    }

    private async saveEvent(event: EventDataExtended, contractAddress: string): Promise<EventMetadata> {
        switch (event.event) {
            case tokenNetworkEvents.channelOpened:
                return await this.plainToClassAndSaveOnDb(this.channelOpenedModel, ChannelOpenedDto, event)

            case tokenNetworkEvents.channelClosed:
                return await this.plainToClassAndSaveOnDb(this.channelClosedModel, ChannelClosedDto, event)

            case tokenNetworkEvents.channelNewDeposit:
                return await this.plainToClassAndSaveOnDb(this.channelNewDepositModel, ChannelNewDepositDto, event)

            case tokenNetworkEvents.channelSettled:
                return await this.plainToClassAndSaveOnDb(this.channelSettledModel, ChannelSettledDto, event)

            case tokenNetworkEvents.channelWithdraw:
                return await this.plainToClassAndSaveOnDb(this.channelWithdrawModel, ChannelWithdrawDto, event)

            case tokenNetworkEvents.nonClosingBalanceProofUpdated:
                return await this.plainToClassAndSaveOnDb(this.nonClosingBalanceProofUpdatedModel, NonClosingBalanceProofUpdatedDto, event)

            default:
                Logger.debug("MISSING EVENT: " + event.event)
                return
        }
    }

    private async plainToClassAndSaveOnDb(model: Model<Document>, type: ClassType<any>, event: EventDataExtended) {
        const parsedEvent = plainToClass(type, event, { enableImplicitConversion: true, excludeExtraneousValues: true })
        model.findOneAndUpdate({ transactionHash: parsedEvent.transactionHash }, parsedEvent, { upsert: true }, async (err, doc) => {
            if (!doc) await this.updateOverview(event.event, event.blockTimestamp, event.address)
        }).exec()
        return parsedEvent
    }

    private async updateOverview(eventType: string, eventTimestamp: number | string, tokenNetwork: string) {
        return await this.tokenNetworkOverviewModel.findOneAndUpdate(
            { tokenNetwork: tokenNetwork, },
            { $inc: { [`${ChannelEventToFieldMap[eventType]}`]: 1, } },
            { upsert: true, new: true },
        ).exec()
    }



    private async createTokenNetworkOverview(date: number, tokenNetwork: string) {
        const previousMonthYearDate: string = this.fromBlockTimestampToPreviousMonthYear(date)
        const monthYearDate: string = this.fromBlockTimestampToMonthYear(date)
        console.log(`Created new ${monthYearDate}  ${tokenNetwork}`)

        const lastMonthOverview: TokenNetworkOverview = await this.tokenNetworkOverviewModel.findOne(
            {
                tokenNetwork: tokenNetwork,
                month: previousMonthYearDate
            }
        ).exec()
        return await this.tokenNetworkOverviewModel.findOneAndUpdate(
            { tokenNetwork: tokenNetwork, month: monthYearDate },
            {
                $setOnInsert: {
                    tokenNetwork: tokenNetwork,
                    month: monthYearDate,
                    channelOpened: 0,
                    channelOpenedTot: lastMonthOverview ? lastMonthOverview.channelOpenedTot : 0,
                    channelClosed: 0,
                    channelClosedTot: lastMonthOverview ? lastMonthOverview.channelClosedTot : 0,
                    channelSettled: 0,
                    channelSettledTot: lastMonthOverview ? lastMonthOverview.channelSettledTot : 0,
                    depositCount: 0,
                    depositCountTot: lastMonthOverview ? lastMonthOverview.depositCountTot : 0,
                    withdrawCount: 0,
                    withdrawCountTot: lastMonthOverview ? lastMonthOverview.withdrawCountTot : 0,
                }
            },
            { upsert: true, new: true },
        ).exec()
    }

    fromBlockTimestampToMonthYear(blockTimeStamp: number) {
        return `${new Date(blockTimeStamp).getUTCMonth() + 1}-${new Date(blockTimeStamp).getUTCFullYear()}`
    }

    fromBlockTimestampToPreviousMonthYear(blockTimeStamp: number) {
        return `${new Date(blockTimeStamp).getUTCMonth()}-${new Date(blockTimeStamp).getUTCFullYear()}`
    }
}


const tokenNetworkEvents = {
    channelOpened: "ChannelOpened",
    channelNewDeposit: "ChannelNewDeposit",
    channelClosed: "ChannelClosed",
    channelSettled: "ChannelSettled",
    channelWithdraw: "ChannelWithdraw",
    nonClosingBalanceProofUpdated: "NonClosingBalanceProofUpdated",
}