import { merge } from 'lodash';
import { Logger, PinoLogger } from 'nestjs-pino';
import type { Params } from 'nestjs-pino';

// type Level = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export function createConfig(): Params {
  return {
    pinoHttp: {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      transport: {
        target: 'pino-pretty',
        options: {
          singleLine: true,
          colorize: true,
          levelFirst: true,
        },
      },
      customProps: () => ({
        context: 'HTTP',
      }),
    },
  };
}

export function createLogger(options?: Params) {
  return new Logger(new PinoLogger(merge(createConfig(), options)), {});
}
