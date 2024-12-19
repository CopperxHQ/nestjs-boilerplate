import { DatabaseRepository } from '../../common/database/decorators/repository.decorator';
import { AbstractRepository } from '../../common/database/repositories/abstract.repository';
import { WalletAddress } from '../entities/wallet-address.entity';

@DatabaseRepository(WalletAddress)
export class WalletAddressRepository extends AbstractRepository<WalletAddress> {}
