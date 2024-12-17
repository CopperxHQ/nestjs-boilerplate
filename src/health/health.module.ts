import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}
