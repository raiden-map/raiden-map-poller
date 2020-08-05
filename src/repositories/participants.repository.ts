import { Injectable } from "@nestjs/common";
import { ChannelOpened } from "src/models/channel-opened.model";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ChannelClosed } from "src/models/channel-closed.model";



@Injectable()
export class ParticipantRepository {
    constructor(
        @InjectModel(ChannelClosed.name) private readonly channelClosedModel: Model<ChannelClosed>,
        @InjectModel(ChannelOpened.name) private readonly channelOpenedModel: Model<ChannelOpened>,
    ) { }

    async getParticipantOverviewOf(contract: string) {
        const participant1 = await this.channelOpenedModel
            .aggregate([

                { $match: { address: contract ? contract : { $regex: /.*/ } } },
                {
                    $group: {
                        _id: { participant: "$returnValues.participant1" },
                        participant: { $first: "$returnValues.participant1" },
                        count: { $sum: 1 },
                        channel_identifiers: { $addToSet: "$returnValues.channel_identifier" }
                    }
                },
                { $project: { _id: 0 } },
            ])

        const participant2 = await this.channelOpenedModel
            .aggregate([

                { $match: { address: contract ? contract : { $regex: /.*/ } } },
                {
                    $group: {
                        _id: { participant: "$returnValues.participant2" },
                        participant: { $first: "$returnValues.participant2" },
                        count: { $sum: 1 },
                        channel_identifiers: { $addToSet: "$returnValues.channel_identifier" }
                    }
                },
                { $project: { _id: 0 } },
            ])

        participant1.map((participant) => {
            let tmp = participant2.find(p => p.participant === participant.participant)
            if (tmp) {
                participant.count += tmp.count
                participant.channel_identifiers = participant.channel_identifiers.concat(tmp.channel_identifiers)
                participant2.splice(participant2.indexOf(tmp), 1)
            }
        })

        return participant1.concat(participant2)
    }

}

