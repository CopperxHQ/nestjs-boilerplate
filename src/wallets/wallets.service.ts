import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletRepository } from 'src/database/repositories/wallet.repository';
import { WalletAddressRepository } from 'src/database/repositories/wallet-address.repository';

@Injectable()
export class WalletsService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly walletAddressRepository: WalletAddressRepository
  ) {}

  create(createWalletDto: CreateWalletDto) {
    const wallet = this.walletRepository.create(createWalletDto);
    // const wallets = this.walletProviderService.createWallets();
    // console.log(wallets);
    return 'This action adds a new wallet';
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
