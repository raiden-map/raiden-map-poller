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
import { ChannelTimelineOverview } from 'src/models/channel-timeline-overview.model';
import { ChannelOpenedRepository } from 'src/repositories/channel-opened.repository';
import { ChannelClosedRepository } from 'src/repositories/channel-closed.repository';
import { ChannelOpenedStatus, ChannelClosedStatus, ChannelEventsStatus } from 'src/models/common/channel-event-status.common';
import { ChannelTimelineOverviewDto } from 'src/models/dto/channel-timeline-overview.dto';

@Injectable()
export class EventsScannerService {

    private tokenNetworkOverview: { [id: string]: TokenNetworkOverview } = {}

    constructor(
        @Inject('web3') private readonly web3: Web3,
        private readonly channelOpenedRepository: ChannelOpenedRepository,
        private readonly channelClosedRepository: ChannelClosedRepository,
        @InjectModel(ChannelClosed.name) private readonly channelClosedModel: Model<ChannelClosed>,
        @InjectModel(ChannelNewDeposit.name) private readonly channelNewDepositModel: Model<ChannelNewDeposit>,
        @InjectModel(ChannelOpened.name) private readonly channelOpenedModel: Model<ChannelOpened>,
        @InjectModel(ChannelSettled.name) private readonly channelSettledModel: Model<ChannelSettled>,
        @InjectModel(ChannelWithdraw.name) private readonly channelWithdrawModel: Model<ChannelWithdraw>,
        @InjectModel(NonClosingBalanceProofUpdated.name) private readonly nonClosingBalanceProofUpdatedModel: Model<NonClosingBalanceProofUpdated>,
        @InjectModel(TokenNetworkOverview.name) private readonly tokenNetworkOverviewModel: Model<TokenNetworkOverview>,
        @InjectModel(ChannelTimelineOverview.name) private readonly channelTimelineOverviewModel: Model<ChannelTimelineOverview>,
    ) { }

    async getEvents(contract: Contract, fromBlock: number | string, toBlock: number | string): Promise<EventDataExtended[]> {
        const eventsData: EventData[] = await contract.getPastEvents('AllEvents', { fromBlock: fromBlock, toBlock: toBlock })
        const eventsDataExt: EventDataExtended[] = await Promise.all(eventsData.map(async (event: EventData) => {
            return { ...event, blockTimestamp: parseInt(((await this.web3.eth.getBlock(event.blockNumber)).timestamp).toString() + '000') }
        }))
        //Logger.debug(`${this.getEvents.name}: ${contract.options.address} . From ${fromBlock} to ${toBlock}`)
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
        let blockNumber = 10100000//TODO save lastblock on DB, use it here
        Logger.debug(`Start: ${contract.options.address}.`)

        setInterval(() => {
            this.web3.eth.getBlockNumber().then(lastBlock => {
                if (lastBlock > blockNumber) {
                    //Logger.debug(`Check for new events on contract: ${contract.options.address}. From ${blockNumber} to ${lastBlock}`)
                    this.getAndSaveNewEvents(contract, blockNumber, lastBlock).then(events => {
                        if (events.length > 0 && events[0] !== undefined)
                            this.updateTimeline(contract.options.address, blockNumber, events[0].blockTimestamp)
                                .then(() => {
                                    blockNumber = lastBlock + 1
                                    Logger.debug(`Timeline updated: ${contract.options.address}`)
                                })
                    })
                }
            })
        }, 2 * 60000)

    }

    async getAndSaveNewEvents(contract: Contract, fromBlock: number | string, toBlock: number | string): Promise<EventMetadata[]> {
        const eventsDataExt: EventDataExtended[] = await this.getEvents(contract, fromBlock, toBlock)
        const events: EventMetadata[] = await Promise.all(eventsDataExt.map(async (event: EventDataExtended) => await this.saveEvent(event, contract.options.address)))
        Logger.debug(`Getted and saved if not present ${events.length} events from contract: ${contract.options.address}. From ${fromBlock} to ${toBlock}`)
        return events.filter(ev => ev !== undefined)
    }

    private async saveEvent(event: EventDataExtended, contractAddress: string): Promise<EventMetadata> {
        switch (event.event) {
            case tokenNetworkEvents.channelOpened:
                return await this.plainToClassAndSaveOnDb(this.channelOpenedModel, ChannelOpenedDto, event)

            case tokenNetworkEvents.channelClosed:
                return await this.plainToClassAndSaveOnDb(this.channelClosedModel, ChannelClosedDto, event)

            case tokenNetworkEvents.channelNewDeposit:
                const newDepositEvent: ChannelNewDepositDto = await this.plainToClassAndSaveOnDb(this.channelNewDepositModel, ChannelNewDepositDto, event) as ChannelNewDepositDto
                if (newDepositEvent) this.updateOverview("DepositAmount", newDepositEvent.blockTimestamp, newDepositEvent.address, newDepositEvent.returnValues.total_deposit / 1000000000000000000)
                return newDepositEvent

            case tokenNetworkEvents.channelSettled:
                return await this.plainToClassAndSaveOnDb(this.channelSettledModel, ChannelSettledDto, event)

            case tokenNetworkEvents.channelWithdraw:
                const withdrawEvent: ChannelWithdrawDto = await this.plainToClassAndSaveOnDb(this.channelWithdrawModel, ChannelWithdrawDto, event) as ChannelWithdrawDto
                if (withdrawEvent) this.updateOverview("WithdrawAmount", withdrawEvent.blockTimestamp, withdrawEvent.address, withdrawEvent.returnValues.total_withdraw / 1000000000000000000)
                return withdrawEvent

            case tokenNetworkEvents.nonClosingBalanceProofUpdated:
                return await this.plainToClassAndSaveOnDb(this.nonClosingBalanceProofUpdatedModel, NonClosingBalanceProofUpdatedDto, event)

            default:
                Logger.debug("MISSING EVENT: " + event.event)
                return
        }
    }

    private async plainToClassAndSaveOnDb(model: Model<Document>, type: ClassType<any>, event: EventDataExtended): Promise<EventMetadata> {
        const parsedEvent = plainToClass(type, event, { enableImplicitConversion: true, excludeExtraneousValues: true })
        try {
            return model.findOne({ transactionHash: parsedEvent.transactionHash }).exec().then(async eventDoc => {
                if (!eventDoc) {
                    const saved = await (new model(parsedEvent)).save()
                    await this.updateOverview(event.event, event.blockTimestamp, event.address)
                    return parsedEvent
                }
            })
        } catch (error) {
            console.log(event)
        }
        return
    }

    private async updateOverview(eventType: string, eventTimestamp: number | string, tokenNetwork: string, quantity = 1) {
        return await this.tokenNetworkOverviewModel.findOneAndUpdate(
            { tokenNetwork: tokenNetwork, },
            { $inc: { [`${ChannelEventToFieldMap[eventType]}`]: quantity, } },
            { upsert: true, new: true },
        ).exec()
    }

    private async updateTimeline(contract: string, block: number, blockTimestamp: number) {
        const lastChannelTimeline: ChannelTimelineOverview = await this.channelTimelineOverviewModel.findOne({ tokenNetwork: contract }).exec()
        const lastBlockTimestamp = (lastChannelTimeline && lastChannelTimeline.channelOpened[0]) ? lastChannelTimeline.channelOpened[lastChannelTimeline.channelOpened.length - 1].blockTimestamp : 0
        if (lastBlockTimestamp < blockTimestamp) {
            const lastOpenedCount = (lastChannelTimeline && lastChannelTimeline.channelOpened[0]) ? lastChannelTimeline.channelOpened[lastChannelTimeline.channelOpened.length - 1].opened_channels_sum : 0
            const lastClosedCount = (lastChannelTimeline && lastChannelTimeline.channelClosed[0]) ? lastChannelTimeline.channelClosed[lastChannelTimeline.channelClosed.length - 1].closed_channels_sum : 0
            const channelsOpened: ChannelOpenedStatus[] = await this.channelOpenedRepository.getOpenedChannelTimelineOverviewOfFromBlock(contract, block)
            const channelsClosed: ChannelClosedStatus[] = await this.channelClosedRepository.getClosedChannelTimelineOverviewOfFromBlock(contract, block)

            const res: ChannelEventsStatus[] = channelsOpened.concat(channelsClosed).sort((a, b) => a.blockTimestamp - b.blockTimestamp)

            //opened channel go down when closed channel go up
            let closedCount = 0
            res.map((event: any) => {
                if (event.closed_channels_sum) closedCount += (event.closed_channels_sum - closedCount)
                else event.opened_channels_sum -= closedCount
            })

            const newChannelTimeline: ChannelTimelineOverviewDto = { tokenNetwork: contract, ...this.fillMissingEvent(res, lastOpenedCount, lastClosedCount) }

            if (lastChannelTimeline) {
                lastChannelTimeline.channelOpened = lastChannelTimeline.channelOpened.concat(newChannelTimeline.channelOpened)
                lastChannelTimeline.channelClosed = lastChannelTimeline.channelClosed.concat(newChannelTimeline.channelClosed)
                await lastChannelTimeline.updateOne(lastChannelTimeline).exec()
            } else {
                await (new this.channelTimelineOverviewModel(newChannelTimeline)).save()
            }
        }
    }

    private fillMissingEvent(res: any[], lastOpenedCount: number, lastClosedCount: number): { channelOpened: ChannelOpenedStatus[], channelClosed: ChannelClosedStatus[] } {
        const opened: ChannelOpenedStatus[] = []
        const closed: ChannelClosedStatus[] = []
        let lastOpened = 0
        let lastClosed = 0

        res.forEach(ev => {
            if (ev.opened_channels_sum) {
                opened.push(ev)
                closed.push({ blockTimestamp: ev.blockTimestamp, closed_channels_sum: lastClosed })
                lastOpened = ev.opened_channels_sum
            } else {
                opened.push({ blockTimestamp: ev.blockTimestamp, opened_channels_sum: lastOpened - (ev.closed_channels_sum - lastClosed) })
                closed.push(ev)
                lastOpened -= (ev.closed_channels_sum - lastClosed)
                lastClosed = ev.closed_channels_sum
            }
        })
        opened.map(op => op.opened_channels_sum += lastOpenedCount)
        closed.map(op => op.closed_channels_sum += lastClosedCount)
        return { channelOpened: opened, channelClosed: closed }
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