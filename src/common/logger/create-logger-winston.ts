import { merge } from 'lodash';
import { WinstonModule, WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import { CONFIG } from '../../config/config';

export declare type LogLevel =
  // | 'log'
  'error' | 'warn' | 'debug' | 'verbose' | 'info';

const logLevels: Record<LogLevel, number> = {
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  verbose: 5,
};

const logLevelColors: Record<string, string> = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'grey',
  verbose: 'cyan',
};

function createConfig(): WinstonModuleOptions {
  return {
    level: CONFIG.LOG_LEVEL,
    levels: logLevels,
    format: winston.format.combine(
      winston.format.colorize({
        level: true,
        colors: logLevelColors,
      }),
      winston.format.timestamp({
        format: 'YYYY-MM-DDTHH:mm:ss.SSSSZZ',
      }),
      winston.format.printf((info: any) => {
        return `${info.timestamp} [${info.level}] [${info.context ?? '-'}] - ${info.message}`;
      })
    ),
    transports: [new winston.transports.Console()],
  };
}

export function createLogger(options?: WinstonModuleOptions) {
  return WinstonModule.createLogger(merge(createConfig(), options));
}
