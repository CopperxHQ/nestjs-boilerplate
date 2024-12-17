import { Module } from '@nestjs/common';
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';
import { LoggerModule } from 'nestjs-pino';
import { createConfig } from './common/logger/create-logger-pino';

@Module({
  imports: [LoggerModule.forRoot(createConfig()), HealthModule],
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
