import { Schema } from 'mongoose';

export const TokenNetworkCreatedSchema = new Schema({
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
        token_address: String,
        token_network_address: String,
    }
})