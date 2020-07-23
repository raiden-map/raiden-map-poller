import { Schema } from 'mongoose';

export const ChannelClosedSchema = new Schema({
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
        closing_participant: String,
        nonce: Number,
        balance_hash: String,
    }
})