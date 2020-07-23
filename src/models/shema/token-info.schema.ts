import { Schema } from 'mongoose';

export const TokenInfoSchema = new Schema({
    name: String,
    symbol: String,
    image: String,
    address: String,
    tokenNetworkAddress: String,
})