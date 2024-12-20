import { Injectable, Logger } from '@nestjs/common';

import { ChainId, EvmChainId } from 'src/database/entities/chain.entity';
import { IWalletProvider } from './interfaces/wallet-provider.interface';
import { EvmWalletService } from './evm/evm-wallet.service';
import { ChainRepository } from 'src/database/repositories/chain.repository';

@Injectable()
export class WalletProviderService {
  private providers: { [ChainId: string]: IWalletProvider } = {};

  constructor(private readonly chainRepository: ChainRepository) {}

  async getProvider(id: ChainId) {
    if (Object.keys(this.providers).length === 0) {
      const chains = await this.chainRepository.find();

      for (const chain of chains) {
        this.providers[chain.chainId] = new EvmWalletService(chain);
      }

      Logger.debug('Chain and provider initialized');
    }

    const provider = this.providers[id];
    return provider;
  }

  async createWalletAddresses() {
    const chainIds = [EvmChainId.SepoliaTestnet, EvmChainId.BaseSepoliaTestnet];
    const promises = chainIds.map(async (chainId) => {
      const provider = await this.getProvider(chainId);
      const walletAddresses = await provider.createWallet();
      return walletAddresses;
    });

    const walletAddresses = await Promise.all(promises);

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
