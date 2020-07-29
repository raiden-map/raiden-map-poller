import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { Model } from 'mongoose';
import { EventDataExtended } from 'src/models/common/event-data-extended.common';
import { TokenNetworkCreatedDto } from 'src/models/dto/token-network-created.dto';
import { TokenNetworkCreated } from 'src/models/token-network-created.model';
import { EventsScannerService } from 'src/services/events-scanner.service';
import { SmartContractService } from 'src/services/smart-contract.service';
import { TokenInfoService } from 'src/services/token-info.service';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
@Injectable()
export class PollerService implements OnModuleInit {
    greenlet
    constructor(
        @InjectModel(TokenNetworkCreated.name) private readonly tokenNetworkCreatedModel: Model<TokenNetworkCreated>,
        @Inject('web3') private readonly web3: Web3,
        private readonly smartContractService: SmartContractService,
        private readonly eventsScannerService: EventsScannerService,
        private readonly tokenInfoService: TokenInfoService,
    ) {
    }

    async onModuleInit() {

    }
    async init() {
        const tokenRegistryContractAddress: string = await this.smartContractService.getTokenRegistryContract()
        const tokenRegistryContract: Contract = await this.smartContractService.initContractObject(tokenRegistryContractAddress)

        //TODO call getAndSaveNewEvents or scanTokenNetworkContractEvents
        const tokenNetworksEvent: EventDataExtended[] = await this.eventsScannerService.getAllEvents(tokenRegistryContract)
        const tokenNetworks: TokenNetworkCreatedDto[] = tokenNetworksEvent.map(tokenNetwork => plainToClass(TokenNetworkCreatedDto, tokenNetwork, { enableImplicitConversion: true, excludeExtraneousValues: true }))

        tokenNetworks.forEach(async tokenNetwork => {
            await this.tokenNetworkCreatedModel.findOneAndUpdate({ transactionHash: tokenNetwork.transactionHash }, { $setOnInsert: tokenNetwork }, { upsert: true }).exec()
            await this.tokenInfoService.saveTokenInfo(tokenNetwork.returnValues.token_address, tokenNetwork.returnValues.token_network_address)
        })

        const tokenNetworkContracts: Contract[] = await Promise.all(
            tokenNetworks.map(
                async tokenNetwork => await this.smartContractService.initContractObject(tokenNetwork.returnValues.token_network_address)
            )
        )

        tokenNetworkContracts.map(tnc => this.eventsScannerService.scanSmartContractEvents(tnc))
    }





}
