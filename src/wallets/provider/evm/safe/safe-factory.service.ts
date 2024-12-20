import Safe, { PredictedSafeProps, SafeAccountConfig } from '@safe-global/protocol-kit';
import { Address } from 'viem';
import { getEVMRpcUrl } from '../client';
import { EvmChainId } from 'src/database/entities/chain.entity';

const SAFE_VERSION = '1.4.1';

export type ISafeWalletConfig = {
  owners: Address[];
  threshold: number;
  chainId: EvmChainId;
};

export class SafeFactory {
  public readonly safeFactory: Safe;

  protected constructor(safeFactory: Safe) {
    this.safeFactory = safeFactory;
  }

  static async create(config: ISafeWalletConfig): Promise<SafeFactory> {
    const predictedSafe: PredictedSafeProps = {
      safeAccountConfig: {
        owners: config.owners,
        threshold: config.threshold,
      },
      safeDeploymentConfig: {
        saltNonce: '12',
        safeVersion: SAFE_VERSION,
      },
    };
    console.log('predictedSafe', getEVMRpcUrl(config.chainId));

    const safeFactory = await Safe.init({
      provider: getEVMRpcUrl(config.chainId),
      predictedSafe,
    });

    console.log('safeFactory');

    return new SafeFactory(safeFactory);
  }

  static async getSafeInstance(safeAddress: Address, chainId: EvmChainId) {
    const safeFactory = await Safe.init({
      provider: getEVMRpcUrl(chainId),
      safeAddress,
    });

    return new SafeFactory(safeFactory);
  }

  async predictAddress(): Promise<Address> {
    console.log('predictAddress', await this.safeFactory.getChainId(), await this.safeFactory.getAddress());
    return this.safeFactory.getAddress();
  }
}
