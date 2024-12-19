import { Module } from '@nestjs/common';
import { ChainService } from './chain.service';
import { ChainController } from './chain.controller';
import { DatabaseModule } from '../database/database.module';
import { ChainRepository } from '../database/repositories/chain.repository';

@Module({
  imports: [DatabaseModule.forRepository([ChainRepository])],
  controllers: [ChainController],
  providers: [ChainService],
})
export class ChainModule {}
