import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function setupSwagger(app: INestApplication, version: string): Promise<void> {
  // const documentBuilder = new DocumentBuilder()
  //   .setTitle('API')
  //   .setDescription(`REST API documentation`)
  //   .setVersion(version)
  //   .addBearerAuth();

  // const document = SwaggerModule.createDocument(app, documentBuilder.build());

  // SwaggerModule.setup('/api/docs', app, document, {
  //   swaggerOptions: {
  //     persistAuthorization: true,
  //   },
  //   customSiteTitle: 'API documentation',
  // });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Starknet Wallet API')
    .setDescription('API documentation for Starknet Wallet Service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    extraModels: [],
  });

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  Logger.log(`Documentation: /api/docs`);
}
