import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KAFKA_BROKERS, KAFKA_CLIENT_ID, KAFKA_CONSUMER_GROUP } from './constants/kafka.constant';

export const KAFKA_SERVICE = 'KAFKA_SERVICE';
@Module({
})
export class KafkaModule {
  static register(consumerGroup : string) : DynamicModule {
    return {
      module: KafkaModule,
      imports : [
        ClientsModule.register([
          {
            name: KAFKA_SERVICE,
            transport: Transport.KAFKA,
            options: {
              client: {
                brokers: [KAFKA_BROKERS],
                clientId: KAFKA_CLIENT_ID,
              },
              consumer: {
                groupId: consumerGroup ?? KAFKA_CONSUMER_GROUP,
              },
            },
          },
        ])
      ],
      exports: [ClientsModule],
    }
  }
}
