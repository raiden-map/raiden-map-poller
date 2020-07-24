import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenNetworkCreated } from 'src/models/token-network-created.model';
import { TokenInfo } from 'src/models/token-info.model';

@Injectable()
export class TokenNetworkService {

    constructor(
        @InjectModel('TokenNetworkCreated') private readonly tokenNetworkCreatedModel: Model<TokenNetworkCreated>,
        @InjectModel('TokenInfo') private readonly tokenInfoModel: Model<TokenInfo>,
    ) { }

    getTokenInfoOf(contract: string) {
        throw new Error("Method not implemented.");
    }
    
    async getAllTokenInfo() {
        return await this.tokenInfoModel.find().exec()
    }

    async getAllTokenNetworks() {
        return await this.tokenNetworkCreatedModel.find().exec()
    }
}
