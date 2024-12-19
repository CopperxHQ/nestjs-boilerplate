import { DatabaseRepository } from '../../common/database/decorators/repository.decorator';
import { AbstractRepository } from '../../common/database/repositories/abstract.repository';
import { Asset } from '../entities/asset.entity';

@DatabaseRepository(Asset)
export class AssetRepository extends AbstractRepository<Asset> {}
