import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from '../entities/abstract.entity';

export abstract class AbstractDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(entity: AbstractEntity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
