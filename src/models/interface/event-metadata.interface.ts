export interface IEventMetadata {
    blockTimestamp: number;
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
    returnValues: {}
}