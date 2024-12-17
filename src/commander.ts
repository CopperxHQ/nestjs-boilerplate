import { CommanderModule } from './commander.module';
import { CommandFactory } from 'nest-commander';

import { createLogger } from './common/logger/create-logger-pino';

async function bootstrap() {
  await CommandFactory.run(CommanderModule, createLogger());
}
bootstrap();
