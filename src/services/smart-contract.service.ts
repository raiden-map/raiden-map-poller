import { Injectable, HttpService, HttpException, HttpStatus, Inject, Logger } from '@nestjs/common';
import { environments } from 'src/environments/environments';
import { Contract } from 'web3-eth-contract';
import Web3 from 'web3';

@Injectable()
export class SmartContractService {
    constructor(
        @Inject('web3') private readonly web3: Web3,
        private readonly http: HttpService,
    ) { }

    async getTokenRegistryContract(): Promise<string> {
        const res = await this.http.get(environments.raidenContractUrl).toPromise()
        Logger.debug('TokenRegistry SmartContract address getted.')
        return res.data.contracts.TokenNetworkRegistry.address
    }

    async initContractObject(contractAddress: string): Promise<Contract> {
        const contractABI: [] = await this.getContractABI(contractAddress)
        const contract: Contract = new this.web3.eth.Contract(contractABI, contractAddress)
        return contract
    }

    async getContractABI(contractAddress: string): Promise<[]> {
        const res = await this.http.get(environments.getABIUrl(contractAddress, environments.etherScanAPIKey)).toPromise()

        if (res.status !== 200)
            throw new HttpException(res.statusText, res.status)
        if (res.data.message === "OK") {
            Logger.debug(`SmartContractABI getted: ${contractAddress}`)
            return JSON.parse(res.data.result)
        }
        else
            throw new HttpException(res.data.message, HttpStatus.BAD_REQUEST)
    }

}
