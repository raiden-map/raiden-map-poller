import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChannelClosed } from 'src/models/channel-closed.model';
import { ChannelNewDeposit } from 'src/models/channel-new-deposit.model';
import { ChannelOpened } from 'src/models/channel-opened.model';
import { ChannelSettled } from 'src/models/channel-settled.model';
import { ChannelWithdraw } from 'src/models/channel-withdraw.model';
import { NonClosingBalanceProofUpdated } from 'src/models/non-closing-balance-proof-updated.model';
import { TokenInfo } from 'src/models/token-info.model';
import { TokenNetworkCreated } from 'src/models/token-network-created.model';
import { ChannelOpenedStatus, ChannelClosedStatus } from 'src/models/common/channel-event-status.common';

@Injectable()
export class TokenNetworkService {


    constructor(
        @InjectModel(TokenNetworkCreated.name) private readonly tokenNetworkCreatedModel: Model<TokenNetworkCreated>,
        @InjectModel(TokenInfo.name) private readonly tokenInfoModel: Model<TokenInfo>,
        @InjectModel(ChannelClosed.name) private readonly channelClosedModel: Model<ChannelClosed>,
        @InjectModel(ChannelNewDeposit.name) private readonly channelNewDepositModel: Model<ChannelNewDeposit>,
        @InjectModel(ChannelOpened.name) private readonly channelOpenedModel: Model<ChannelOpened>,
        @InjectModel(ChannelSettled.name) private readonly channelSettledModel: Model<ChannelSettled>,
        @InjectModel(ChannelWithdraw.name) private readonly channelWithdrawModel: Model<ChannelWithdraw>,
        @InjectModel(NonClosingBalanceProofUpdated.name) private readonly nonClosingBalanceProofUpdatedModel: Model<NonClosingBalanceProofUpdated>,
    ) { }

    getTokenInfoOf(contract: string) {
        throw new Error("Method not implemented.");
    }

    async getAllTokenInfo() {
        return await this.tokenInfoModel.find().exec()
    }

    async getAllTokenNetworks() {
        return await this.tokenNetworkCreatedModel.find().exec()
    }

    async getOpenedChannelOf(contract: string): Promise<ChannelOpened[]> {
        return await this.channelOpenedModel.find({ address: contract }).exec()
    }

    async getClosedChannelOf(contract: string): Promise<ChannelClosed[]> {
        return await this.channelClosedModel.find({ address: contract }).exec()
    }

    async getChannelsOf(contract: string) {
        const channelsOpened: any[] = await this.getOpenedChannelOverview(contract, this.channelOpenedModel)
        const channelsClosed: any[] = await this.getClosedChannelOverview(contract, this.channelClosedModel)

        channelsClosed.map((channel, index) => { if (index > 0) channel.closed_channels_sum += channelsClosed[index - 1].closed_channels_sum })
        channelsOpened.map((channel, index) => { if (index > 0) channel.opened_channels_sum += channelsOpened[index - 1].opened_channels_sum })

        let res = channelsOpened.concat(channelsClosed).sort((a, b) => a.blockTimestamp - b.blockTimestamp)

        let closedCount = 0
        res.map((event) => {
            if (event.closed_channels_sum) closedCount += (event.closed_channels_sum - closedCount)
            else event.opened_channels_sum -= closedCount
        })

        var groupBy = function (xs, key) {
            return xs.reduce(function (rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});
        };
        let pastOpenedEvent: ChannelOpenedStatus
        let pastClosedEvent: ChannelClosedStatus
        const opened = res.map(ev => {
            if (ev.closed_channels_sum === undefined) {
                pastOpenedEvent = ev
                return ev
            }
            else {
                pastClosedEvent = ev
                return {
                    block: ev.block,
                    blockTimestamp: ev.blockTimestamp,
                    opened_channel_identifiers: [-1],
                    opened_channels_sum: pastOpenedEvent.opened_channels_sum,
                } as ChannelOpenedStatus
            }
        })
        const closed = res.map(ev => {
            if (ev.closed_channels_sum !== undefined) {
                pastClosedEvent = ev
                return ev
            }
            else {
                pastOpenedEvent = ev
                return {
                    block: ev.block,
                    blockTimestamp: ev.blockTimestamp,
                    closed_channel_identifiers: [-1],
                    closed_channels_sum: pastClosedEvent.closed_channels_sum,
                } as ChannelClosedStatus
            }
        })
        return { openedChannel: opened, closedChannel: closed }
    }

    private async getOpenedChannelOverview(contract: string, model: Model<any>) {
        return await model
            .aggregate([
                { $match: { address: contract } },
                {
                    $group: {
                        _id: { blockTimestamp: "$blockTimestamp" },
                        blockTimestamp: { $first: "$blockTimestamp" },
                        block: { $first: "$blockNumber" },
                        opened_channels_sum: { $sum: 1 },
                        opened_channel_identifiers: { $addToSet: "$returnValues.channel_identifier" }
                    }
                },
                { $project: { _id: 0 } }
            ]).sort({ 'blockTimestamp': 1 })
    }

    private async getClosedChannelOverview(contract: string, model: Model<any>) {
        return await model
            .aggregate([
                { $match: { address: contract } },
                {
                    $group: {
                        _id: { blockTimestamp: "$blockTimestamp" },
                        blockTimestamp: { $first: "$blockTimestamp" },
                        block: { $first: "$blockNumber" },
                        closed_channels_sum: { $sum: 1 },
                        closed_channel_identifiers: { $addToSet: "$returnValues.channel_identifier" }
                    }
                },
                { $project: { _id: 0 } }
            ]).sort({ 'blockTimestamp': 1 })
    }
}
