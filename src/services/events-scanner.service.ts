import { Injectable, Inject } from '@nestjs/common';
import Web3 from 'web3';
import { Contract, EventData } from 'web3-eth-contract';

@Injectable()
export class EventsScannerService {

    constructor(@Inject('web3') private readonly web3: Web3) {}

    async getEvent(contract: Contract, fromBlock: number | string, toBlock: number | string): Promise<EventData[]> {
        return await contract.getPastEvents('AllEvents', { fromBlock: fromBlock, toBlock: toBlock })
    }

    async getAllEvent(contract: Contract): Promise<EventData[]> {
        return await contract.getPastEvents('AllEvents', { fromBlock: 10000000, toBlock: 'latest' })
    }
}
