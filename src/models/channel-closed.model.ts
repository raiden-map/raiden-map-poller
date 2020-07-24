import { EventMetadata } from "./abstract/event-metadata.abstract";
import { IEventMetadata } from "./interface/event-metadata.interface";
import { Document } from 'mongoose';

export class ChannelClosed extends Document implements IEventMetadata {
    address: string;
    blockHash: string;
    blockNumber: number;
    logIndex: number;
    removed: boolean;
    transactionHash: string;
    transactionIndex: number;
    id: string;
    event: string;
    signature: string;
    returnValues: {
        channel_identifier: number;
        closing_participant: string;
        nonce: number;
        balance_hash: string;
    }
}