import { EventMetadata } from "./abstract/event-metadata.abstract";
import { IEventMetadata } from "./interface/event-metadata.interface";
import { Document } from 'mongoose';

export class ChannelSettled extends Document implements IEventMetadata {
    address: string;
    blockHash: string;
    blockNumber: number;
    logIndex: number;
    removed: boolean;    transactionHash: string;
    transactionIndex: number;
    id: string;
    event: string;
    signature: string;
    returnValues: {
        channel_identifier: number;
        participant1_amount: number;
        participant1_locksroot: string;
        participant2_amount: number;
        participant2_locksroot: string;
    }
}