import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class TokenInfo extends Document {
    @Prop() name: string;
    @Prop() symbol: string;
    @Prop() imgUrl: string;
    @Prop() homepage: string;
    @Prop() twitterName: string;
    @Prop() contract: string;
    @Prop() tokenNetwork: string;
}

export const TokenInfoSchema = SchemaFactory.createForClass(TokenInfo);
