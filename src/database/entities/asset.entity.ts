import { AbstractSoftEntity } from 'src/common/entities/abstract-soft.entity';
import { Address } from 'src/common/transformers/address/address';
import { AddressTransformer } from 'src/common/transformers/address/address.transformer';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Chain } from './chain.entity';
import { UuidColumn } from 'src/common/database/decorators/columns/Uuid';

@Entity()
@Index(['chainId', 'address'], {
  unique: true,
})
export class Asset extends AbstractSoftEntity {
  @UuidColumn()
  @Index()
  chainId: string;

  @Column({
    transformer: AddressTransformer,
    type: 'varchar',
  })
  address: Address;

  @Column()
  name: string;

  @Column()
  symbol: string;

  @Column({ type: 'int', default: 18 })
  decimals: number;

  @Column({ nullable: true })
  icon?: string;

  // @Column({ type: 'uuid', nullable: true })
  // organizationId?: string;

  // @JoinColumn({
  //   name: 'organizationId',
  // })
  // @ManyToOne(() => Organization)
  // organization: Promise<Organization>;
  @ManyToOne(() => Chain, (chain) => chain.assets)
  @JoinColumn({ name: 'chainId' })
  chain: Chain;
}
