import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketController } from './tickets.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [TicketController],
  providers: [TicketsService],
})
export class TicketsModule {}
