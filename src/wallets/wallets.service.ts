import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletRepository } from 'src/database/repositories/wallet.repository';
import { WalletAddressRepository } from 'src/database/repositories/wallet-address.repository';
import { WalletProviderService } from './provider/provider.service';

@Injectable()
export class WalletsService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly walletAddressRepository: WalletAddressRepository,
    private readonly walletProviderService: WalletProviderService
  ) {}

  async create(createWalletDto: CreateWalletDto) {
    const wallet = await this.walletRepository.create(createWalletDto);
    const wallets = await this.walletProviderService.createWalletAddresses();
    console.log(wallet, wallets);
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
