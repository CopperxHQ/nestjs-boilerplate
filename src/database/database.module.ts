import { DynamicModule, Module, Provider } from '@nestjs/common';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { CONFIG } from '../config/config';
import { DataSource } from 'typeorm';
import { CUSTOM_REPOSITORY_KEY } from '../common/database/decorators/repository.decorator';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      entities: [
        join(__dirname, '..', '/**/*.entity{.ts,.js}'),
        join(__dirname, '..', '/**/*.view-entity{.ts,.js}'),
      ],
      migrations: [join(__dirname, '/migrations/*{.ts,.js}')],
      url: CONFIG.POSTGRES_URL,
      migrationsRun: CONFIG.ORM_AUTO_MIGRATION,
      logging: CONFIG.ORM_LOGGING_ENABLED,
      autoLoadEntities: true,
      dropSchema: false,
      synchronize: CONFIG.isDev,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {
  public static forRepository<T extends new (...args: any[]) => any>(repositories: T[]): DynamicModule {
    const providers: Provider[] = [];

    for (const repository of repositories) {
      const entity = Reflect.getMetadata(CUSTOM_REPOSITORY_KEY, repository);

      if (!entity) {
        continue;
      }

      providers.push({
        inject: [getDataSourceToken()],
        provide: repository,
        useFactory: (dataSource: DataSource): typeof repository => {
          const baseRepository = dataSource.getRepository<any>(entity);
          return new repository(baseRepository.target, baseRepository.manager, baseRepository.queryRunner);
        },
      });
    }

    return {
      exports: providers,
      module: DatabaseModule,
      providers,
    };
  }
}
