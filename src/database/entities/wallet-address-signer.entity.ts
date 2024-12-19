import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractSoftEntity } from '../../common/entities/abstract-soft.entity';
import { WalletAddress } from './wallet-address.entity';
import { UuidColumn } from 'src/common/database/decorators/columns/Uuid';

export enum SignerType {
  Circle = 'circle',
  Fireblocks = 'fireblocks',
  Copper = 'copper',
  // Add more signer types as needed
}

export enum SignerStatus {
  Pending = 'pending',
  Active = 'active',
  Failed = 'failed',
  Disabled = 'disabled',
}

@Entity()
export class WalletAddressSigner extends AbstractSoftEntity {
  @UuidColumn()
  walletAddressId: string;

  @Column({
    type: 'enum',
    enum: SignerType,
    nullable: false,
  })
  type: SignerType;

  @Column()
  signerId: string;

  @Column()
  address: string;

  @Column({
    type: 'enum',
    enum: SignerStatus,
    default: SignerStatus.Pending,
  })
  status: SignerStatus;

  @Column({
    type: 'json',
    nullable: true,
    default: {},
  })
  metadata?: Record<string, any>;

  // Relationships
  @ManyToOne(() => WalletAddress, (walletAddress) => walletAddress.signers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'walletAddressId' })
  walletAddress: WalletAddress;
}
