import { Schema } from 'mongoose';

export const ChannelSettledSchema = new Schema({
    blockTimestamp: Number,
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
        participant1_amount: Number,
        participant1_locksroot: String,
        participant2_amount: Number,
        participant2_locksroot: String,
    }
})