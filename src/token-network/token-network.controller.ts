import { Controller, Get, Param } from '@nestjs/common';
import { TokenNetworkService } from './token-network.service';

@Controller('token-network')
export class TokenNetworkController {

    constructor(private readonly tokenNetworkService: TokenNetworkService) { }

    @Get()
    getTokenNetworks() {
        return this.tokenNetworkService.getAllTokenNetworks()
    }

    @Get('info')
    getTokenInfo() {
        return this.tokenNetworkService.getAllTokenInfo()
    }

    @Get('info/:contract')
    getTokenInfoOf(@Param() contract: string) {
        return this.tokenNetworkService.getTokenInfoOf(contract)
    }
}
