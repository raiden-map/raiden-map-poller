import { Injectable } from "@nestjs/common";
import { ChannelOpened } from "src/models/channel-opened.model";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ChannelClosed } from "src/models/channel-closed.model";



@Injectable()
export class ChannelClosedRepository {
    constructor(
        @InjectModel(ChannelClosed.name) private readonly channelClosedModel: Model<ChannelClosed>,
    ) { }


    async getClosedChannelTimelineOverviewOf(contract: string) {
        const channelsClosed = (await this.channelClosedModel
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
            ]).sort({ 'blockTimestamp': 1 }))

        channelsClosed.map((channel, index) => { if (index > 0) channel.closed_channels_sum += channelsClosed[index - 1].closed_channels_sum })
        return channelsClosed
    }


    async getClosedChannelTimelineOverviewOfFromBlock(contract: string, block: number) {
        const channelsClosed = (await this.channelClosedModel
            .aggregate([
                { $match: { address: contract, blockNumber: { $gte: block } } },
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
            ]).sort({ 'blockTimestamp': 1 }))

        channelsClosed.map((channel, index) => { if (index > 0) channel.closed_channels_sum += channelsClosed[index - 1].closed_channels_sum })
        return channelsClosed
    }

}