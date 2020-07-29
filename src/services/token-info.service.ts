import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { environments } from 'src/environments/environments';
import { TokenInfoDto } from 'src/models/dto/token-info.dto';
import { ToTokenInfoPipe } from 'src/pipes/to-token-info.pipe';
import { TokenInfo } from 'src/models/token-info.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TokenInfoService {
    constructor(
        @InjectModel('TokenInfo') private readonly tokenInfoModel: Model<TokenInfo>,
        private readonly http: HttpService,
        private readonly toTokenInfoPipe: ToTokenInfoPipe,
    ) { }

    private async getTokenInfo(constractAddress: string): Promise<TokenInfoDto> {
        try {
            const res = await this.http.get(environments.getTokenInfo(constractAddress)).toPromise()
            return this.toTokenInfoPipe.transform(res.data)

        } catch (error) {
            throw new HttpException("Coingeko error", HttpStatus.BAD_REQUEST)
        }
    }

    async saveTokenInfo(contractAddress: string, tokenNetworkAddress: string): Promise<TokenInfo> {
        const tokenInfo: TokenInfoDto = { ...await this.getTokenInfo(contractAddress), tokenNetwork: tokenNetworkAddress }
        return await this.tokenInfoModel.findOneAndUpdate({ contract: contractAddress.toLowerCase() }, tokenInfo, { upsert: true }).exec()
    }
}
