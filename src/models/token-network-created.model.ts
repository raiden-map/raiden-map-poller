import { Document } from 'mongoose';
import { IEventMetadata } from "./interface/event-metadata.interface";
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class TokenNetworkCreated extends Document implements IEventMetadata {

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
        token_address: string;
        token_network_address: string;
    };
}

export const TokenNetworkCreatedSchema = SchemaFactory.createForClass(TokenNetworkCreated);
