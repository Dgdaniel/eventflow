import { Controller, Get, Headers, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { TicketsServiceService } from './tickets-service.service';
import { CheckInTicketDto, PurchaseTicketDto } from '@app/common';

@Controller()
export class TicketsServiceController {
  constructor(private readonly ticketsServiceService: TicketsServiceService) { }


  @Get('my-tickets')
  async findMyTickets(@Headers('x-user-id') userId: string) {
    return this.ticketsServiceService.findMyTicket(userId);
  }

  @Post('purchase')
  async purchaseTicket(
    @Body() body: PurchaseTicketDto,
    @Headers('x-user-id') userId: string
  ) {
    return this.ticketsServiceService.purchase(body, userId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string,
    @Headers('x-user-id') userId: string) {
    return this.ticketsServiceService.findOne(id, userId);
  }

  @Post(':id/cancel')
  async cancelTicket(@Param('id', ParseUUIDPipe) id: string,
    @Headers('x-user-id') userId: string) {
    return this.ticketsServiceService.cancelTicket(id, userId);
  }

  @Post(':id/validate')
  async validateTicket(@Body() body: CheckInTicketDto,
    @Headers('x-user-id') userId: string) {
    return this.ticketsServiceService.checkIn(body.ticketCode, userId);
  }

  @Get('events/:eventId')
  async findEventTickets(@Param('eventId', ParseUUIDPipe) eventId: string,
    @Headers('x-user-id') organizerId: string) {
    return this.ticketsServiceService.findEventTickets(eventId, organizerId);
  }

}
