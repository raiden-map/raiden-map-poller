import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { Model } from 'mongoose';
import { ChannelOpened } from 'src/models/channel-opened.model';
import { TokenNetworkCreatedDto } from 'src/models/dto/token-network-created.dto';
import { TokenNetworkCreated } from 'src/models/token-network-created.model';
import { ContractsScraperService } from 'src/services/contracts-scraper.service';
import { EventsScannerService } from 'src/services/events-scanner.service';
import { TokenInfoService } from 'src/services/token-info.service';
import Web3 from 'web3';
import { Contract, EventData } from 'web3-eth-contract';

@Injectable()
export class PollerService implements OnModuleInit {
    constructor(
        @InjectModel('TokenNetworkCreated') private readonly tokenNetworkCreatedModel: Model<TokenNetworkCreated>,
        @InjectModel('ChannelOpened') private readonly channelOpenedModel: Model<ChannelOpened>,
        @Inject('web3') private readonly web3: Web3,
        private readonly contractsScraperService: ContractsScraperService,
        private readonly eventsScannerService: EventsScannerService,
        private readonly tokenInfoService: TokenInfoService,
    ) { }

    async onModuleInit() {
    }
    async init() {

        const tokenRegistryContractAddress: string = await this.contractsScraperService.getTokenRegistryContract()
        const tokenRegistryContract: Contract = await this.initContractObject(tokenRegistryContractAddress)

        const tokenNetworksEvent: EventData[] = await this.eventsScannerService.getAllEvent(tokenRegistryContract)
        const tokenNetworks: TokenNetworkCreatedDto[] = tokenNetworksEvent.map(tokenNetwork => plainToClass(TokenNetworkCreatedDto, tokenNetwork, { enableImplicitConversion: true, excludeExtraneousValues: true }))

        tokenNetworks.forEach(async tokenNetwork => {
            await this.tokenNetworkCreatedModel.findOneAndUpdate({ transactionHash: tokenNetwork.transactionHash }, { $setOnInsert: tokenNetwork }, { upsert: true }).exec()
            await this.tokenInfoService.saveTokenInfo(tokenNetwork.returnValues.token_address)
        })

        const tokenNetworkContracts: Contract[] = await Promise.all(tokenNetworks.map(async tokenNetwork => await this.initContractObject(tokenNetwork.returnValues.token_network_address)))

        const event: EventData[] = await this.eventsScannerService.getAllEvent(tokenNetworkContracts[1])
    }


    async initContractObject(contractAddress: string): Promise<Contract> {
        const contractABI: [] = await this.contractsScraperService.getContractABI(contractAddress)
        const contract: Contract = new this.web3.eth.Contract(contractABI, contractAddress)
        return contract
    }


}
