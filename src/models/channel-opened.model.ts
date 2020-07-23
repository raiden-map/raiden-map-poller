import { EventMetadata } from "./abstract/event-metadata.abstract";
import { Document } from 'mongoose';
import { IEventMetadata } from "./interface/event-metadata.interface";

export class ChannelOpened extends Document implements IEventMetadata {
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
        participant1: string;
        participant2: string;
        settle_timeout: number;
    }
}