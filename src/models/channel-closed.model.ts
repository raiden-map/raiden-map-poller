import { EventMetadata } from "./abstract/event-metadata.abstract";
import { IEventMetadata } from "./interface/event-metadata.interface";
import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class ChannelClosed extends Document implements IEventMetadata {
    @Prop() blockTimestamp: number;
    @Prop() address: string;
    @Prop() blockHash: string;
    @Prop() blockNumber: number;
    @Prop() logIndex: number;
    @Prop() removed: boolean;
    @Prop({ unique: true }) transactionHash: string;
    @Prop() transactionIndex: number;
    @Prop() id: string;
    @Prop() event: string;
    @Prop() signature: string;
    @Prop() returnValues: {
        channel_identifier: number;
        closing_participant: string;
        nonce: number;
        balance_hash: string;
    }
}

export const ChannelClosedSchema = SchemaFactory.createForClass(ChannelClosed);
