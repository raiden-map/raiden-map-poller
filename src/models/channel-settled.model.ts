import { EventMetadata } from "./abstract/event-metadata.abstract";
import { IEventMetadata } from "./interface/event-metadata.interface";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class ChannelSettled extends Document implements IEventMetadata {
    @Prop() blockTimestamp: number;
    @Prop() address: string;
    @Prop() blockHash: string;
    @Prop() blockNumber: number;
    @Prop() logIndex: number;
    @Prop() removed: boolean;
    @Prop() transactionHash: string;
    @Prop() transactionIndex: number;
    @Prop() id: string;
    @Prop() event: string;
    @Prop() signature: string;
    @Prop() returnValues: {
        channel_identifier: number;
        participant1_amount: number;
        participant1_locksroot: string;
        participant2_amount: number;
        participant2_locksroot: string;
    }
}

export const ChannelSettledSchema = SchemaFactory.createForClass(ChannelSettled);


