import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  KAFKA_BROKERS,
  KAFKA_CLIENT_ID,
} from '@app/kafka/constants/kafka.constant';
import { SERVICE_PORT } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: `${KAFKA_CLIENT_ID}-notifications`,
        brokers: [KAFKA_BROKERS],
      },
      consumer: {
        groupId: `notifications-consumer-group`,
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(SERVICE_PORT.NOTIFICATIONS_SERVICE ?? 4009);
  console.log(
    `Notifications service is running on port ${SERVICE_PORT.NOTIFICATIONS_SERVICE}`,
  );
}
bootstrap();
