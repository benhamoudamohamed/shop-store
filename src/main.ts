import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import * as helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger()
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe())

  app.use(cookieParser());
 
  const configService = app.get(ConfigService)
  const port = configService.get('PORT');
  const origin = configService.get('ORIGIN');
  app.enableCors({origin: origin})

  const hostname = 'localhost';
  await app.listen(port, hostname);
  logger.verbose(`App is running on: ${await app.getUrl()}`);
  logger.warn(`Accepting request from '${origin}' in '${process.env.NODE_ENV}' Mode`); 

  app.use(helmet());
  app.use(csurf());
} 
bootstrap();
