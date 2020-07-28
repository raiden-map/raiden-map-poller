import Web3 from 'web3'
import { Module, HttpModule } from '@nestjs/common';
import { PollerService } from './poller.service';
import { PollerController } from './poller.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SmartContractService } from 'src/services/smart-contract.service';
import { EventsScannerService } from 'src/services/events-scanner.service';
import { environments } from 'src/environments/environments';
import { TokenInfoService } from 'src/services/token-info.service';
import { ToTokenInfoPipe } from 'src/pipes/to-token-info.pipe';
import { TokenNetworkCreated, TokenNetworkCreatedSchema } from 'src/models/token-network-created.model';
import { TokenInfoSchema, TokenInfo } from 'src/models/token-info.model';
import { ChannelSettled, ChannelSettledSchema } from 'src/models/channel-settled.model';
import { ChannelNewDeposit, ChannelNewDepositSchema } from 'src/models/channel-new-deposit.model';
import { ChannelClosed, ChannelClosedSchema } from 'src/models/channel-closed.model';
import { ChannelOpened, ChannelOpenedSchema } from 'src/models/channel-opened.model';
import { ChannelWithdrawSchema, ChannelWithdraw } from 'src/models/channel-withdraw.model';
import { NonClosingBalanceProofUpdatedSchema, NonClosingBalanceProofUpdated } from 'src/models/non-closing-balance-proof-updated.model';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: ChannelOpened.name, schema: ChannelOpenedSchema },
      { name: ChannelClosed.name, schema: ChannelClosedSchema },
      { name: ChannelNewDeposit.name, schema: ChannelNewDepositSchema },
      { name: ChannelSettled.name, schema: ChannelSettledSchema },
      { name: ChannelWithdraw.name, schema: ChannelWithdrawSchema },
      { name: NonClosingBalanceProofUpdated.name, schema: NonClosingBalanceProofUpdatedSchema },
      { name: TokenNetworkCreated.name, schema: TokenNetworkCreatedSchema },
      { name: TokenInfo.name, schema: TokenInfoSchema },
    ]),
  ],
  providers: [
    PollerService,
    SmartContractService,
    EventsScannerService,
    TokenInfoService,
    ToTokenInfoPipe,
    {
      provide: 'web3',
      useFactory: () => new Web3(environments.ethMainnetNode),
    }
  ],
  controllers: [PollerController]
})
export class PollerModule { }
