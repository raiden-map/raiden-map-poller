import { Module } from '@nestjs/common';
import { TokenNetworkController } from './token-network.controller';
import { TokenNetworkService } from './token-network.service';
import { TokenInfoSchema } from 'src/models/shema/token-info.schema';
import { TokenNetworkCreatedSchema } from 'src/models/shema/token-network-created.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'TokenNetworkCreated', schema: TokenNetworkCreatedSchema },
      { name: 'TokenInfo', schema: TokenInfoSchema },
    ])
  ],
  controllers: [TokenNetworkController],
  providers: [TokenNetworkService]
})
export class TokenNetworkModule { }
