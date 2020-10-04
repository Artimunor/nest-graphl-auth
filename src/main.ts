import * as helmet from 'helmet';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.enable('trust proxy');
  //app.use(helmet());

  // if (NODE_ENV === 'production') {
  //   app.use('/*', httpsRedirect());
  //   app.get('/*', wwwRedirect());
  //   app.use(rateLimit({
  //     windowMs: 15 * 60 * 1000, // 15 minutes
  //     max: 100, // limit each IP to 100 requests per windowMs
  //   }));
  // }

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
  Logger.log(`Server is running on: ${await app.getUrl()}`, 'main');
}
bootstrap();
