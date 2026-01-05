import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { ValidationPipe } from '@nestjs/common';
import { SERVICE_PORT, SERVICES } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(SERVICE_PORT.AUTH_SERVICE);
  console.log(`Auth service is running on port ${SERVICE_PORT.AUTH_SERVICE}`);
}
bootstrap();
