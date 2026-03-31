import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { PurchaseTicketDto } from '@app/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('tickets')
@UseGuards(AuthGuard('jwt'))
export class TicketController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('purchase')
  async purchaseTicket(
    @Body() purchaseDto: PurchaseTicketDto,
    @Request() req: { user: { userId: string; role?: string } },
  ) {
    return this.ticketsService.purchaseTicket(purchaseDto, req.user.userId);
  }

  @Post(':id/cancel')
  async cancelTicket(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { userId: string; role?: string } },
  ) {
    return this.ticketsService.cancelTicket(id, req.user.userId);
  }

  @Post(':id/validate')
  async validateTicket(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { userId: string; role?: string } },
  ) {
    return this.ticketsService.validateTicket(id, req.user.userId);
  }

  @Get('events/:eventId')
  async findEventTickets(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Request() req: { user: { userId: string; role?: string } },
  ) {
    return this.ticketsService.findEventTickets(eventId, req.user.userId);
  }

  @Get('my-tickets')
  async findMyTickets(
    @Request() req: { user: { userId: string; role?: string } },
  ) {
    return this.ticketsService.findMyTickets(req.user.userId);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { userId: string; role?: string } },
  ) {
    return this.ticketsService.findOne(id, req.user.userId);
  }
}
