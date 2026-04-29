import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsServiceController } from './events-service.controller';
import { EventsServiceService } from './events-service.service';
import { KafkaModule } from '@app/kafka';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), KafkaModule.register('events-service-group'), DatabaseModule],
  controllers: [EventsServiceController],
  providers: [EventsServiceService],
})
export class EventsServiceModule {}
