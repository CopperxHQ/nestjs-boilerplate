import { DatabaseRepository } from '../../common/database/decorators/repository.decorator';
import { AbstractRepository } from '../../common/database/repositories/abstract.repository';
import { WalletAddressOwner } from '../entities/wallet-address-owner.entity';

@DatabaseRepository(WalletAddressOwner)
export class WalletAddressOwnerRepository extends AbstractRepository<WalletAddressOwner> {}
