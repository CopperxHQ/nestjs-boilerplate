import 'reflect-metadata';
import './boilerplate.polyfill';

import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { json, urlencoded } from 'express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './common/swagger/setup';
import { CONFIG } from './config/config';
import { createLogger } from './common/logger/create-logger-pino';

export async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), {
    rawBody: true,
    bodyParser: true,
    bufferLogs: true,
    cors: CONFIG.CORS,
    // logger: createLogger(),
  });

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));

  // app.use(helmet());
  // app.setGlobalPrefix('/api'); use api as global prefix if you don't have subdomain
  // app.use(
  //   rateLimit({
  //     windowMs: 15 * 60 * 1000, // 15 minutes
  //     max: 100, // limit each IP to 100 requests per windowMs
  //   }),
  // );
  // app.use(compression());
  // app.use(morgan('combined'));

  app.useBodyParser('json', { limit: '10mb' });
  app.useBodyParser('text', { limit: '10mb' });
  app.useBodyParser('urlencoded', { limit: '10mb', extended: true });

  app.useGlobalPipes(new ValidationPipe({ whitelist: false, transform: true }));

  if (CONFIG.SWAGGER_ENABLED) {
    await setupSwagger(app, CONFIG.APP_VESION);
  }

  await app.listen(CONFIG.PORT);

  Logger.log(`Server running on ${await app.getUrl()}`);

  return app;
}

bootstrap();
