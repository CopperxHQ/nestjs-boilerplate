import { DatabaseRepository } from '../../common/database/decorators/repository.decorator';
import { AbstractRepository } from '../../common/database/repositories/abstract.repository';
import { WalletAddressSigner } from '../entities/wallet-address-signer.entity';

@DatabaseRepository(WalletAddressSigner)
export class WalletAddressSignerRepository extends AbstractRepository<WalletAddressSigner> {}
