import { Injectable } from '@nestjs/common';
import { Address } from 'viem';

import { IWalletProvider } from '../interfaces/wallet-provider.interface';
import { WalletAddress, WalletStatus } from 'src/database/entities/wallet-address.entity';
import { Chain, ChainId, EvmChainId } from 'src/database/entities/chain.entity';
import { CircleClient } from '../signers/circle-client';
import { OwnerType, WalletAddressOwner } from 'src/database/entities/wallet-address-owner.entity';
import { SafeFactory } from './safe/safe-factory.service';

@Injectable()
export class EvmWalletService implements IWalletProvider {
  private readonly defaultNonce: number = 0;
  private readonly walletAddress: WalletAddress;
  private readonly chain: Chain;
  private readonly circleClient: CircleClient;

  private static readonly supportedChains = Object.values(EvmChainId);

  constructor(chain: Chain) {
    this.chain = chain;
    // this.relayer = RelayerServiceFactory.relayer();
    this.circleClient = new CircleClient(chain.chainId);
  }

  static getSupportedChains(): ChainId[] {
    return this.supportedChains;
  }

  static isChainSupported(chainId: ChainId): boolean {
    return this.supportedChains.includes(chainId);
  }

  async createWallet(owners?: WalletAddressOwner[]): Promise<WalletAddress> {
    if (!owners || owners.length === 0) {
      owners = await this.createSigner(this.chain.chainId);
    }

    const walletAddress = new WalletAddress();
    walletAddress.chainId = this.chain.id;
    walletAddress.owners = owners;
    walletAddress.status = WalletStatus.Pending;

    // Compute address
    walletAddress.address = await this.computeSafeAddress(walletAddress);

    return walletAddress;
  }

  async createSigner(chainId: ChainId): Promise<WalletAddressOwner[]> {
    const circleClient = new CircleClient(chainId);
    const circleWallet = await circleClient.createWallet();

    const walletSigner = new WalletAddressOwner();
    walletSigner.type = OwnerType.Circle;
    walletSigner.ownerId = circleWallet.id;
    walletSigner.address = circleWallet.address;

    return [walletSigner];
  }

  async computeSafeAddress(walletAddress: WalletAddress): Promise<string> {
    const account = await SafeFactory.create({
      owners: walletAddress.owners.map((owner) => owner.address) as Address[],
      threshold: 1,
      chainId: this.chain.chainId,
    });

    const address = await account.predictAddress();
    return address;
  }
}
