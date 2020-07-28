import { EventMetadata } from "./abstract/event-metadata.abstract";
import { Document } from 'mongoose';
import { IEventMetadata } from "./interface/event-metadata.interface";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class ChannelOpened extends Document implements IEventMetadata {
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
        participant1: string;
        participant2: string;
        settle_timeout: number;
    }
}

export const ChannelOpenedSchema = SchemaFactory.createForClass(ChannelOpened);
