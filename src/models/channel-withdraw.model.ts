import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IEventMetadata } from './interface/event-metadata.interface';
import { Document } from 'mongoose';

@Schema()
export class ChannelWithdraw extends Document implements IEventMetadata {
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
        participant: string;
        total_withdraw: number;
    }
}

export const ChannelWithdrawSchema = SchemaFactory.createForClass(ChannelWithdraw);

