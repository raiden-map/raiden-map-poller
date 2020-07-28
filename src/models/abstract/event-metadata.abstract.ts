import { IEventMetadata } from "../interface/event-metadata.interface";
import { Expose, Transform, Exclude } from "class-transformer";
import { EventData } from 'web3-eth-contract';

export abstract class EventMetadata implements IEventMetadata {
    @Expose() blockTimestamp: number;
    @Expose() address: string;
    @Exclude() blockHash: string;
    @Expose() blockNumber: number;
    @Exclude() logIndex: number;
    @Exclude() removed: boolean;
    @Expose() transactionHash: string;
    @Exclude() transactionIndex: number;
    @Exclude() id: string;
    @Expose() event: string;
    @Exclude() signature: string;
    returnValues: {}
}