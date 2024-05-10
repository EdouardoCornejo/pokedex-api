import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const port = 3000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v2');
  await app.listen(port);
  Logger.log('Server started on port ' + port);
}
bootstrap();
