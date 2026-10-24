import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomLoggerService } from 'src/shared/config/log';

async function bootstrap() {
  const defaultPort = 3000;
  const port = process.env.PORT || defaultPort;
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLoggerService(),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.setGlobalPrefix('api/v2');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Pokedex API')
    .setDescription(
      'REST API that stores Pokemon in MongoDB. Seed it from PokeAPI, then list, search (by MongoDB id, Pokedex number or name), create, update and delete Pokemon.',
    )
    .setVersion('2.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
    customSiteTitle: 'Pokedex API docs',
  });

  await app.listen(port);
  Logger.log('Server started on port ' + port);
}
bootstrap();
