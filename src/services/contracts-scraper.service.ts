import { Injectable, HttpService, HttpException, HttpStatus } from '@nestjs/common';
import { environments } from 'src/environments/environments';

@Injectable()
export class ContractsScraperService {
    constructor(private readonly http: HttpService) { }

    async getTokenRegistryContract(): Promise<string> {
        const res = await this.http.get(environments.raidenContractUrl).toPromise()
        return res.data.contracts.TokenNetworkRegistry.address
    }

    async getContractABI(contractAddress: string): Promise<[]> {
        const res = await this.http.get(environments.getABIUrl(contractAddress, environments.etherScanAPIKey)).toPromise()
        if (res.status !== 200)
            throw new HttpException(res.statusText, res.status)
        if (res.data.message === "OK")
            return JSON.parse(res.data.result)
        else
            throw new HttpException(res.data.message, HttpStatus.BAD_REQUEST)
    }

}
