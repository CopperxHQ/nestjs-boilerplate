import { DatabaseRepository } from '../../common/database/decorators/repository.decorator';
import { AbstractRepository } from '../../common/database/repositories/abstract.repository';
import { Wallet } from '../entities/wallet.entity';

@DatabaseRepository(Wallet)
export class WalletRepository extends AbstractRepository<Wallet> {}
