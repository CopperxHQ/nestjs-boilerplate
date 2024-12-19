import { Module } from '@nestjs/common';
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';
import { LoggerModule } from 'nestjs-pino';
import { createConfig } from './common/logger/create-logger-pino';
import { DatabaseModule } from './database/database.module';
import { ChainModule } from './chain/chain.module';
import { WalletsModule } from './wallets/wallets.module';

@Module({
  imports: [LoggerModule.forRoot(createConfig()), DatabaseModule, HealthModule, ChainModule, WalletsModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useFactory: (adapter: HttpAdapterHost) => new AllExceptionsFilter(adapter),
      inject: [HttpAdapterHost],
    },
  ],
})
export class AppModule {}
