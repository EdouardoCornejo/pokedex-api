import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { CustomLoggerService } from 'src/shared/config/log';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLoggerService(),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix('api/v2');
  await app.listen(port);
  Logger.log('Server started on port ' + port);
}
bootstrap();
