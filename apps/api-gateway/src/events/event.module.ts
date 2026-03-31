import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [HttpModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
