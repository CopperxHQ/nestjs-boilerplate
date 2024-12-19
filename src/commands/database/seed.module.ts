import { Module } from '@nestjs/common';
import { SeedCommand } from './seed.command';
import { DatabaseModule } from 'src/database/database.module';
import { ChainRepository } from 'src/database/repositories/chain.repository';
import { AssetRepository } from 'src/database/repositories/asset.repository';

@Module({
  imports: [DatabaseModule.forRepository([ChainRepository, AssetRepository])],
  providers: [SeedCommand],
})
export class SeedCommandModule {}
