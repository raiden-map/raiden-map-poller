import { Exclude, Expose } from 'class-transformer';
import { IEventMetadata } from './interface/event-metadata.interface';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class NonClosingBalanceProofUpdated extends Document implements IEventMetadata {
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
        closing_participant: string;
        nonce: number;
        balance_hash: string;
    }
}

export const NonClosingBalanceProofUpdatedSchema = SchemaFactory.createForClass(NonClosingBalanceProofUpdated);
