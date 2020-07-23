import { IEventMetadata } from "../interface/event-metadata.interface";
import { Expose, Transform, Exclude } from "class-transformer";

export abstract class EventMetadata implements IEventMetadata{
    @Expose() address: string;
    @Expose() blockHash: string;
    @Expose() blockNumber: number;
    @Expose() logIndex: number;
    @Expose() removed: boolean;
    @Expose() transactionHash: string;
    @Expose() transactionIndex: number;
    @Expose() id: string;
    @Expose() event: string;
    @Expose() signature: string;
    returnValues: {}
}