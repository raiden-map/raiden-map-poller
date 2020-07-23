import { Schema } from 'mongoose';

export const ChannelOpenedSchema = new Schema({
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
        participant1: String,
        participant2: String,
        settle_timeout: Number,
    }
})