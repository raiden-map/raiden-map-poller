import { Module, HttpModule } from '@nestjs/common';
import { AppService } from './app.service';
import { PollerModule } from './poller/poller.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenNetworkModule } from './token-network/token-network.module';
import { environments } from './environments/environments';
import { AppController } from 'src/app.controller';

//const mongodb = 'mongodb://localhost:27017/raiden-map'
const mongodb = 'mongodb://51.136.5.3:27017/raiden-map'

@Module({
  imports: [
    MongooseModule.forRoot(mongodb, {
      user: environments.mongoUser, pass: environments.mongoPsw,
      useFindAndModify: false
    }),
    PollerModule,
    //TokenNetworkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
