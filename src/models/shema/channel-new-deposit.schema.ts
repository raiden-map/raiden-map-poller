import { Schema } from 'mongoose';

export const ChannelNewDepositSchema = new Schema({
    address: String,
    blockHash: String,
    blockNumber: Number,
    logIndex: Number,
    removed: Boolean,
    transactionHash: String,
    transactionIndex: Number,
    id: String,
    event: String,
    signature: String,
    returnValues: {
        channel_identifier: Number,
        participant: String,
        total_deposit: Number,
    }
})