import { DeepPartial, FindManyOptions, FindOptionsWhereProperty, Repository } from 'typeorm';
import { AbstractEntity } from '../entities/abstract.entity';

export class AbstractEntityService<TEntity extends AbstractEntity> {
  constructor(protected repository: Repository<TEntity>) {}

  // async findById(id: number): Promise<TEntity> {
  //   return await this.get(id);
  // }

  // async getAll(): Promise<TEntity[]> {
  //   return this.repository.find();
  // }

  // find(conditions: FindManyOptions<TEntity>): Promise<TEntity[]> {
  //   return this.repository.find(conditions);
  // }

  // get(id: FindOptionsWhereProperty<TEntity['id'], TEntity['id']>): Promise<TEntity> {
  //   return this.repository.findOne({ where: { id } });
  // }

  // getOrFail(id: number): Promise<TEntity> {
  //   return this.repository.findOneOrFail({ where: { id } });
  // }

  // create(entity: DeepPartial<TEntity>): Promise<TEntity> {
  //   return this.repository.save(entity);
  // }

  // update(entity: DeepPartial<TEntity>): Promise<TEntity> {
  //   return this.repository.save(entity);
  // }

  // async delete(id: number): Promise<void> {
  //   const entity = await this.get(id);
  //   if (entity) {
  //     await this.repository.remove(entity);
  //   }
  // }
}
