import { Injectable } from "@nestjs/common";
import { ChannelOpened } from "src/models/channel-opened.model";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";



@Injectable()
export class ChannelOpenedRepository {
    constructor(
        @InjectModel(ChannelOpened.name) private readonly channelOpenedModel: Model<ChannelOpened>,
    ) { }


    async getOpenedChannelTimelineOverviewOf(contract: string) {
        const channelsOpened = (await this.channelOpenedModel
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
            ]).sort({ 'blockTimestamp': 1 }))

        channelsOpened.map((channel, index) => { if (index > 0) channel.opened_channels_sum += channelsOpened[index - 1].opened_channels_sum })
        return channelsOpened
    }

    async getOpenedChannelTimelineOverviewOfFromBlock(contract: string, block: number) {
        const channelsOpened = (await this.channelOpenedModel
            .aggregate([
                { $match: { address: contract, blockNumber: { $gte: Number(block) } } },
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
            ]).sort({ 'blockTimestamp': 1 }))
        channelsOpened.map((channel, index) => { if (index > 0) channel.opened_channels_sum += channelsOpened[index - 1].opened_channels_sum })
        return channelsOpened
    }

}