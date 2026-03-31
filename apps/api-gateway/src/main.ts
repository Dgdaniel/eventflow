import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SERVICE_PORT } from '@app/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(SERVICE_PORT.API_GATEWAY);
  console.log(`Api gateway is running on port ${SERVICE_PORT.API_GATEWAY}`);
}
bootstrap();
