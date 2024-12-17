import { CONFIG } from './src/config/config';

module.exports = [
  {
    type: 'postgres',
    entities: ['./src/**/*.entity{.ts,.js}', './src/**/*.view-entity{.ts,.js}'],
    migrations: ['./src/database/migrations/*{.ts,.js}'],
    url: CONFIG.POSTGRES_URL,
    migrationsRun: true,
    dropSchema: false,
    synchronize: false,
  },
];
