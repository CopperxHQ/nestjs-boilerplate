import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { DatabaseModule } from 'src/database/database.module';
import { WalletRepository } from 'src/database/repositories/wallet.repository';
import { WalletAddressRepository } from 'src/database/repositories/wallet-address.repository';
import { WalletProviderService } from './provider/provider.service';
import { ChainRepository } from 'src/database/repositories/chain.repository';

@Module({
  imports: [DatabaseModule.forRepository([WalletRepository, WalletAddressRepository, ChainRepository])],
  controllers: [WalletsController],
  providers: [WalletsService, WalletProviderService],
})
export class WalletsModule {}
