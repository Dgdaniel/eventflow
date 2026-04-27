import { Module } from '@nestjs/common';
import { KafkaModule } from '@app/kafka';
import { DatabaseModule } from '@app/database';
import { TicketsServiceController } from './tickets-service.controller';
import { TicketsServiceService } from './tickets-service.service';

@Module({
  imports: [KafkaModule.register('tickets-service-group'), DatabaseModule],
  controllers: [TicketsServiceController],
  providers: [TicketsServiceService],
})
export class TicketsServiceModule {}
