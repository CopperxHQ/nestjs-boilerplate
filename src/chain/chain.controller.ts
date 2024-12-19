import { Controller, Get, Param } from '@nestjs/common';
import { ChainService } from './chain.service';

@Controller('chain')
export class ChainController {
  constructor(private readonly chainService: ChainService) {}

  @Get()
  findAll() {
    return this.chainService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chainService.findOne(+id);
  }
}
