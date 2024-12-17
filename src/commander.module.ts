import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { BasicCommandModule } from './commands/basic/basic.module';

@Module({
  imports: [
    // LoggerModule.forRoot({
    //   pinoHttp: {
    //     transport: {
    //       target: 'pino-pretty',
    //       options: {
    //         singleLine: true,
    //         colorize: true,
    //         levelFirst: true,
    //       },
    //     },
    //     customProps: () => ({
    //       context: 'HTTP',
    //     }),
    //   },
    // }),
    DatabaseModule,
    BasicCommandModule,
  ],
})
export class CommanderModule {}
