import { Injectable, Logger } from '@nestjs/common';

import { ChainId, EvmChainId } from 'src/database/entities/chain.entity';
import { IWalletProvider } from './interfaces/wallet-provider.interface';
import { EvmWalletService } from './evm/evm-wallet.service';

@Injectable()
export class WalletProviderService {
  private readonly providers: Record<ChainId, IWalletProvider> = {
    [EvmChainId.AmoyTestnet]: new EvmWalletService(EvmChainId.AmoyTestnet),
  };

  constructor() {}

  async getProvider(id: string) {
    const provider = this.providers[id];
    return provider;
  }

  async createWalletAddresses() {
    // Create wallet addresses for evm chains
    const walletAddresses = await this.providers[EvmChainId.AmoyTestnet].createWallet();
    console.log(walletAddresses);

    // const wallets = Object.keys(this.providers).map((chainId) =>
    //   this.providers[chainId].createWallet(chainId)
    // );
    // Logger.log(wallets);
    return [walletAddresses];
  }

  async createWallet(chainId: ChainId) {
    const provider = this.providers[chainId];
    if (!provider) {
      throw new Error(`Provider for chain ${chainId} not found`);
    }
    return provider.createWallet();
  }
}
