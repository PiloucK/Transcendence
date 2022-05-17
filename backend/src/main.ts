import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: `http://${configService.get('HOST')}:${configService.get(
      'FRONTEND_PORT',
    )}`,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());

  const port = configService.get('BACKEND_PORT');
  await app.listen(port);
}
bootstrap();
