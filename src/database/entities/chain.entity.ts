import { Column, Entity, Index, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../common/entities/abstract.entity';
import { Asset } from './asset.entity';
import { NumberTransformer } from 'src/common/transformers/number';
import { WalletAddress } from './wallet-address.entity';

export enum ChainType {
  Evm = 'evm',
  Solana = 'solana',
  Tron = 'tron',
}

export enum EvmChainId {
  // Mainnets
  // Polygon = '137',
  // Ethereum = '1',
  // Arbitrum = '42161',
  // Base = '8453',
  // Optimism = '10',
  // Bsc = '56',
  // Solana = '1399811149',

  // Testnets
  // AmoyTestnet = '80002',
  SepoliaTestnet = '11155111',
  // ArbitrumSepoliaTestnet = '421614',
  BaseSepoliaTestnet = '84532',
  // OptimismSepoliaTestnet = '11155420',
  // BscTestnet = '97',
  // SolanaDevnetTestnet = '1399811150',
}

export type ChainId = EvmChainId;

@Entity()
@Index(['type', 'chainId'], { unique: true })
export class Chain extends AbstractEntity {
  @Column({ type: 'enum', enum: ChainType, name: 'enum_chain_type', nullable: true })
  type: ChainType;

  // Native chain id of a particular blockchain
  @Column()
  chainId: ChainId;

  @Column()
  name: string;

  @Column({ type: 'varchar' })
  currency: string;

  @Column()
  icon: string;

  @Column({ type: 'bool', default: false })
  isTestnet: boolean;

  @Column()
  rpcHttp: string;

  @Column({ nullable: true })
  blockExplorerName?: string;

  @Column({ nullable: true })
  blockExplorerTransactionUrl?: string;

  // Relationships
  @OneToMany(() => Asset, (asset) => asset.chain)
  assets?: Asset[];

  @OneToMany(() => WalletAddress, (wallet) => wallet.chain)
  wallets?: WalletAddress[];
}
