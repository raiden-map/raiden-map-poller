export interface IEventMetadata {
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