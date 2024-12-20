import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractSoftEntity } from '../../common/entities/abstract-soft.entity';
import { WalletAddress } from './wallet-address.entity';
import { UuidColumn } from 'src/common/database/decorators/columns/Uuid';

export enum OwnerType {
  Circle = 'circle',
  Fireblocks = 'fireblocks',
  Copper = 'copper',
  // Add more owner types as needed
}

export enum OwnerStatus {
  Pending = 'pending',
  Active = 'active',
  Failed = 'failed',
  Disabled = 'disabled',
}

@Entity()
export class WalletAddressOwner extends AbstractSoftEntity {
  @UuidColumn()
  walletAddressId: string;

  @Column({
    type: 'enum',
    enum: OwnerType,
    nullable: false,
  })
  type: OwnerType;

  @Column()
  ownerId: string;

  @Column()
  address: string;

  @Column({
    type: 'enum',
    enum: OwnerStatus,
    default: OwnerStatus.Pending,
  })
  status: OwnerStatus;

  @Column({
    type: 'json',
    nullable: true,
    default: {},
  })
  metadata?: Record<string, any>;

  // Relationships
  @ManyToOne(() => WalletAddress, (walletAddress) => walletAddress.owners, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'walletAddressId' })
  walletAddress: WalletAddress;
}
