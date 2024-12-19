import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { BasicCommandModule } from './commands/basic/basic.module';
import { SeedCommandModule } from './commands/database/seed.module';

@Module({
  imports: [DatabaseModule, BasicCommandModule, SeedCommandModule],
})
export class CommanderModule {}
