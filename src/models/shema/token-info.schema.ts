import { Schema } from 'mongoose';

export const TokenInfoSchema = new Schema({
    name: String,
    symbol: String,
    imgUrl: String,
    homepage: String,
    twitterName: String,
    contract: String,
})