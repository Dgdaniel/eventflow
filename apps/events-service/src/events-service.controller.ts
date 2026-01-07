import { Controller, Get, Param, Post, Body, Headers, Put, Delete, ParseUUIDPipe, Request } from '@nestjs/common';
import { EventsServiceService } from './events-service.service';
import { CreateEventDto, UpdateEventDto } from '@app/common';

@Controller()
export class EventsServiceController {
  constructor(private readonly eventsServiceService: EventsServiceService) { }


  @Post()
  create(@Body() createEventDto: CreateEventDto,
    @Headers('x-user-id') userId: string) {
    return this.eventsServiceService.createEvent(createEventDto, userId);
  }

  @Get()
  findAll() {
    return this.eventsServiceService.findAll();
  }

  @Get('my-events')
  findMyEvents(@Headers('x-user-id') userId: string) {
    return this.eventsServiceService.findMyEvents(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsServiceService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateEventDto: UpdateEventDto,
    @Request() req: {user: {userId: string, role?: string}}) {
    return this.eventsServiceService.update(
      id, 
      updateEventDto,
      req.user.userId,
      req.user.role || "USER"
    );
  }

  @Post(':id/publish')
  publish(@Param('id', ParseUUIDPipe) id: string,
    @Request() req: {user: {userId: string, role?: string}}) {
    return this.eventsServiceService.publishEvent(id, req.user.userId, req.user.role || "USER");
  }

  @Delete(':id/cancel')
  cancel(@Param('id', ParseUUIDPipe) id: string,
    @Request() req: {user: {userId: string, role?: string}}) {
    return this.eventsServiceService.cancel(id, req.user.userId, req.user.role || "USER");
  }
}
