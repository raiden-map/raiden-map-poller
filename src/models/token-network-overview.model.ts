import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class TokenNetworkOverview extends Document {
    @Prop() month: string;
    @Prop() tokenNetwork: string;
    @Prop() channelOpened: number;
    @Prop() channelOpenedTot: number;
    @Prop() channelClosed: number;
    @Prop() channelClosedTot: number;
    @Prop() channelSettled: number;
    @Prop() channelSettledTot: number;
    @Prop() depositCount: number
    @Prop() depositCountTot: number
    @Prop() depositAmount: number
    @Prop() depositAmountTot: number
    @Prop() withdrawCount: number
    @Prop() withdrawCountTot: number
    @Prop() withdrawAmount: number
    @Prop() withdrawAmountTot: number
}

export const TokenNetworkOverviewSchema = SchemaFactory.createForClass(TokenNetworkOverview);
