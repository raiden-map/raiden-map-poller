import { Module, HttpModule } from '@nestjs/common';
import { PollerService } from './poller.service';
import { PollerController } from './poller.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelOpenedSchema } from 'src/models/shema/channel-opened.schema';
import { ChannelClosedSchema } from 'src/models/shema/channel-closed.schema';
import { ChannelNewDepositSchema } from 'src/models/shema/channel-new-deposit.schema';
import { ChannelSettledSchema } from 'src/models/shema/channel-settled.schema';
import { TokenNetworkCreatedSchema } from 'src/models/shema/token-network-created.schema';
import { TokenInfoSchema } from 'src/models/shema/token-info.schema';
import { ContractsScraperService } from 'src/services/contracts-scraper.service';
import { EventsScannerService } from 'src/services/events-scanner.service';
import Web3 from 'web3'
import { environments } from 'src/environments/environments';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: 'ChannelOpened', schema: ChannelOpenedSchema },
      { name: 'ChannelClosed', schema: ChannelClosedSchema },
      { name: 'ChannelNewDeposit', schema: ChannelNewDepositSchema },
      { name: 'ChannelSettled', schema: ChannelSettledSchema },
      { name: 'TokenNetworkCreated', schema: TokenNetworkCreatedSchema },
      { name: 'TokenInfo', schema: TokenInfoSchema },
    ]),
  ],
  providers: [
    PollerService,
    ContractsScraperService,
    EventsScannerService,
    {
      provide: 'web3',
      useFactory: () => new Web3(environments.ethMainnetNode),
    }
  ],
  controllers: [PollerController]
})
export class PollerModule { }
