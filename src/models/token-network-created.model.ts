import { Document } from 'mongoose';
import { IEventMetadata } from "./interface/event-metadata.interface";

export class TokenNetworkCreated extends Document implements IEventMetadata {
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
        token_address: string;
        token_network_address: string;
    };
}