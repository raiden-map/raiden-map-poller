import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChannelOpened } from 'src/models/channel-opened.model';
import { ContractsScraperService } from 'src/services/contracts-scraper.service';
import { EventsScannerService } from 'src/services/events-scanner.service';
import { Contract } from 'web3-eth-contract';
import Web3 from 'web3';
import { plainToClass } from 'class-transformer';
import { TokenNetworkCreated } from 'src/models/token-network-created.model';
import { TokenNetworkCreatedDto } from 'src/models/dto/token-network-created.dto';

@Injectable()
export class PollerService implements OnModuleInit {
    constructor(
        @InjectModel('ChannelOpened') private readonly userModel: Model<ChannelOpened>,
        @Inject('web3') private readonly web3: Web3,
        private readonly contractsScraperService: ContractsScraperService,
        private readonly eventsScannerService: EventsScannerService,
    ) { }

    async onModuleInit() {
        const tokenRegistryContractAddress: string = await this.contractsScraperService.getTokenRegistryContract()
        const tokenRegistryContractABI: [] = await this.contractsScraperService.getContractABI(tokenRegistryContractAddress)
        const tokenRegistryContract: Contract = new this.web3.eth.Contract(tokenRegistryContractABI, tokenRegistryContractAddress)

        const test = await this.eventsScannerService.getAllEvent(tokenRegistryContract)
        console.log(test)
        test.map(ev => console.log(plainToClass(TokenNetworkCreatedDto, ev, { excludeExtraneousValues: false })))
    }
}
