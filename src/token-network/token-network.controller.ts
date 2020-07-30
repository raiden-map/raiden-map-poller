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
    getTokenInfoOf(@Param() params) {
        return this.tokenNetworkService.getTokenInfoOf(params.contract)
    }

    @Get('channel-opened/:contract')
    getOpenedChannelOf(@Param() params) {
        return this.tokenNetworkService.getOpenedChannelOf(params.contract)
    }

    @Get('channel-closed/:contract')
    getClosedChannelOf(@Param() params) {
        return this.tokenNetworkService.getClosedChannelOf(params.contract)
    }

    @Get('channel-overview/:contract')
    getChannelOf(@Param() params) {
        return this.tokenNetworkService.getChannelsOf(params.contract)
    }

    @Get('participant-overview/:contract')
    getParticipantOverview(@Param() params) {
        return this.tokenNetworkService.getParticipantOverview(params.contract)
    }
}
