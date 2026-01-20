import { NestFactory } from '@nestjs/core';
import { TicketsServiceModule } from './tickets-service.module';
import { ValidationPipe } from '@nestjs/common';
import { SERVICE_PORT } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(TicketsServiceModule);


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(SERVICE_PORT.TICKETS_SERVICE);
}
console.log(`Tickets Service is running on port ${SERVICE_PORT.TICKETS_SERVICE}`);

bootstrap();
