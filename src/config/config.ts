// eslint-disable-next-line @typescript-eslint/no-var-requires
import 'dotenv/config';

import { bool, cleanEnv, EnvError, makeValidator, num, port, str } from 'envalid';

const pemKeys = makeValidator((input: string): string => {
  if (typeof input === 'string' && input.length > 0 && input.startsWith('-----BEGIN ')) {
    return input.replace(/\\n/g, '\n');
  }

  throw new EnvError(`Not a valid PEM key.`);
});

const env = cleanEnv(process.env, {
  PORT: port({ default: 3000, devDefault: 3000 }),
  APP_VESION: str({ default: 'v0.0.0' }),

  SWAGGER_ENABLED: bool({ default: false, devDefault: true }),
  LOG_LEVEL: str({ default: 'debug', devDefault: 'verbose' }),
  CORS: bool({ default: true, devDefault: true }),

  JWT_EXPIRATION_TIME: num({ default: 86400, devDefault: 86400 }),
  JWT_ISSUER: str({
    devDefault: 'http://localhost:3000',
    default: 'nestjs-starter',
  }),
  JWT_PRIVATE_KEY: pemKeys(),
  JWT_PUBLIC_KEY: pemKeys(),

  WEB3_SKIP_ISSUER_VALIDATION: bool({
    devDefault: true,
    default: false,
  }),

  PRIVATE_API_KEY: str({
    devDefault: 'abcdefghijk123456',
  }),

  POSTGRES_URL: str(),

  // POSTGRES_HOST: str(),
  // POSTGRES_PORT: num({ default: 5432, devDefault: 5432 }),
  // POSTGRES_USER: str(),
  // POSTGRES_PASSWORD: str(),
  // POSTGRES_NAME: str(),

  ORM_LOGGING_ENABLED: bool({ default: false, devDefault: false }),
  ORM_AUTO_MIGRATION: bool({ default: true, devDefault: false }),
});

const AppConfig = () => ({ ...env });

export const CONFIG = AppConfig();
