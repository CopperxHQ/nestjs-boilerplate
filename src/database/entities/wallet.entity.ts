import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractSoftEntity } from '../../common/entities/abstract-soft.entity';
import { WalletAddress } from './wallet-address.entity';

@Entity()
export class Wallet extends AbstractSoftEntity {
  // @Column({
  //   nullable: true,
  // })
  // @Index()
  // organizationId: string;

  // @JoinColumn({ name: 'organizationId' })
  // @ManyToOne(() => Organization, {
  //   createForeignKeyConstraints: false,
  // })
  // organization?: Promise<Organization>;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  customerRefId?: string;

  @Column('bool', {
    default: false,
  })
  autoFuel?: boolean;

  @OneToMany(() => WalletAddress, (walletAddress) => walletAddress.wallet, { eager: true })
  addresses: WalletAddress[];
}
