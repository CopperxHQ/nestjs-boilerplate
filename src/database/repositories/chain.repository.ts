import { DatabaseRepository } from '../../common/database/decorators/repository.decorator';
import { AbstractRepository } from '../../common/database/repositories/abstract.repository';
import { Chain } from '../entities/chain.entity';

@DatabaseRepository(Chain)
export class ChainRepository extends AbstractRepository<Chain> {}
