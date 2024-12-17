import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { CONFIG } from '../config/config';

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
      dropSchema: false,
      synchronize: false,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
