import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PollerModule } from './poller/poller.module';
import { MongooseModule } from '@nestjs/mongoose';

const mongodb = 'mongodb://localhost:27017/raiden-map'

@Module({
  imports: [
    MongooseModule.forRoot(mongodb, {useFindAndModify: false}),
    PollerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
