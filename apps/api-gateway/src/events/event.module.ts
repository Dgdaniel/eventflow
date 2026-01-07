import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EventService } from './event.service';
import { EventController } from './event.controller';

@Module({
  imports: [HttpModule],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}