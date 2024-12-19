import { Injectable } from '@nestjs/common';
import { ChainRepository } from '../database/repositories/chain.repository';
import { Chain } from '../database/entities/chain.entity';

@Injectable()
export class ChainService {
  constructor(private readonly chainRepository: ChainRepository) {}

  findAll(): Promise<Chain[]> {
    return this.chainRepository.find({ relations: ['assets'] });
  }

  findOne(id: number) {
    return `This action returns a #${id} chain`;
  }
}
