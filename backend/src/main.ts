import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://0.0.0.0:3000', credentials: true });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.listen(3001);
}
bootstrap();
