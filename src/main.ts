import * as helmet from 'helmet';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
  Logger.log(`Server is running on: ${await app.getUrl()}`, 'main');
}
bootstrap();
