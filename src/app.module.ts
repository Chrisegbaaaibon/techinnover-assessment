import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiModule } from './modules/api.module';
import { MONGO_URI } from './config/env.config';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI),
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
