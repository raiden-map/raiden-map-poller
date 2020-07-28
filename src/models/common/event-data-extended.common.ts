import { EventData } from "web3-eth-contract";

export class EventDataExtended implements EventData {
    returnValues: { [key: string]: any; };
    raw: { data: string; topics: string[]; };
    event: string;
    signature: string;
    logIndex: number;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    address: string;
    blockTimestamp: string | number;
}