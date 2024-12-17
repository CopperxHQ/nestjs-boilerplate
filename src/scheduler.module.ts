import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

// Import Modules which has Cron Schedules
import { CommanderModule } from './commander.module';

@Module({
  imports: [ScheduleModule.forRoot(), CommanderModule],
})
export class SchedulerModule {}
