import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletRepository } from 'src/database/repositories/wallet.repository';
import { WalletAddressRepository } from 'src/database/repositories/wallet-address.repository';
import { WalletProviderService } from './provider/provider.service';
import { Wallet } from 'src/database/entities/wallet.entity';

@Injectable()
export class WalletsService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly walletAddressRepository: WalletAddressRepository,
    private readonly walletProviderService: WalletProviderService
  ) {}

  async create(createWalletDto: CreateWalletDto) {
    const walletAddresses = await this.walletProviderService.createWalletAddresses();

    const wallet = new Wallet();
    wallet.name = createWalletDto.name;
    wallet.customerRefId = createWalletDto.customerRefId;
    wallet.addresses = walletAddresses;

    await this.walletRepository.save(wallet);

    return wallet;
  }

  findAll() {
    return `This action returns all wallets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
