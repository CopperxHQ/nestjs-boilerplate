import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractSoftEntity } from '../../common/entities/abstract-soft.entity';
import { Chain } from './chain.entity';
import { UuidColumn } from 'src/common/database/decorators/columns/Uuid';
import { Wallet } from './wallet.entity';
import { WalletAddressSigner } from './wallet-address-signer.entity';

export enum WalletStatus {
  Pending = 'pending', // Pending message not wallet is not yet created. But only predicted
  Active = 'active',
  Disabled = 'disabled',
}

@Entity()
export class WalletAddress extends AbstractSoftEntity {
  @UuidColumn()
  walletId: string;

  @UuidColumn()
  chainId: string;

  @Column({
    nullable: true,
  })
  address?: string;

  @Column({
    nullable: true,
  })
  status?: WalletStatus;

  /**
   * Nonce used to generate wallet
   */
  @Column({
    nullable: true,
  })
  saltNonce?: string;

  @Column({
    type: 'json',
    nullable: true,
    default: {},
  })
  data?: IWalletData;

  // Relationships
  @ManyToOne(() => Chain, (chain) => chain.wallets, { eager: true })
  chain: Chain;

  @ManyToOne(() => Wallet, (wallet) => wallet.addresses)
  @JoinColumn({ name: 'walletId' })
  wallet?: Wallet;

  @OneToMany(() => WalletAddressSigner, (signer) => signer.walletAddress)
  signers?: WalletAddressSigner[];
}

export interface IWalletData {
  // This is the config used to create safe
  safeTxHash?: string;
}
