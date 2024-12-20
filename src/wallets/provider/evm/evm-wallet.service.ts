import { Injectable } from '@nestjs/common';
import { Address } from 'viem';

import { IWalletProvider } from '../interfaces/wallet-provider.interface';
import { WalletAddress, WalletStatus } from 'src/database/entities/wallet-address.entity';
import { Chain, ChainId, EvmChainId } from 'src/database/entities/chain.entity';
import { CircleClient } from '../signers/circle-client';
import { SignerType, WalletAddressSigner } from 'src/database/entities/wallet-address-signer.entity';
import { SafeFactory } from './safe/safe-factory.service';

@Injectable()
export class EvmWalletService implements IWalletProvider {
  private readonly defaultNonce: number = 0;
  private readonly walletAddress: WalletAddress;
  private readonly chainId: ChainId;
  private readonly circleClient: CircleClient;

  private static readonly supportedChains = Object.values(EvmChainId);

  constructor(chain: Chain) {
    this.chainId = chain.chainId;

    console.log('chainId', typeof this.chainId, this.chainId);
    // this.relayer = RelayerServiceFactory.relayer();
    this.circleClient = new CircleClient(chain.chainId);
  }

  static getSupportedChains(): ChainId[] {
    return this.supportedChains;
  }

  static isChainSupported(chainId: ChainId): boolean {
    return this.supportedChains.includes(chainId);
  }

  async createWallet(): Promise<WalletAddress> {
    const signers = await this.createSigner(this.chainId);

    const walletAddress = new WalletAddress();
    walletAddress.chainId = this.chainId;
    walletAddress.signers = signers;
    walletAddress.status = WalletStatus.Pending;

    // Compute address
    walletAddress.address = await this.computeSafeAddress(walletAddress);

    return walletAddress;
  }

  private async getOrCreateSigner(): Promise<WalletAddressSigner[]> {
    if (this.walletAddress.signers?.length) {
      return this.walletAddress.signers;
    }

    const circleWallet = await this.circleClient.createWallet();

    const walletSigner = new WalletAddressSigner();
    walletSigner.type = SignerType.Circle;
    walletSigner.signerId = circleWallet.id;
    walletSigner.address = circleWallet.address;
    walletSigner.walletAddressId = this.walletAddress.id;

    return [walletSigner];
  }

  async createSigner(chainId: ChainId): Promise<WalletAddressSigner[]> {
    const circleClient = new CircleClient(chainId);
    const circleWallet = await circleClient.createWallet();

    const walletSigner = new WalletAddressSigner();
    walletSigner.type = SignerType.Circle;
    walletSigner.signerId = circleWallet.id;
    walletSigner.address = circleWallet.address;

    return [walletSigner];
  }

  async computeSafeAddress(walletAddress: WalletAddress): Promise<string> {
    const account = await SafeFactory.create({
      owners: walletAddress.signers.map((signer) => signer.address) as Address[],
      threshold: 1,
      chainId: this.chainId,
    });

    const address = await account.predictAddress();

    return address;
  }
}
