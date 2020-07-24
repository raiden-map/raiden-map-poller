import { Document } from 'mongoose';

export class TokenInfo extends Document{
    name: string;
    symbol: string;
    imgUrl: string;
    homepage: string;
    twitterName: string;
    contract: string;
}