import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Patch,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { EventService } from './event.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateEventDto, UpdateEventDto } from '@app/common';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() createEventDto: CreateEventDto,
    @Request() req: { user: { userId: string; role?: string } },
  ) {
    return this.eventService.createEvent(
      createEventDto,
      req.user.userId,
      req.user.role || 'USER',
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Request() req: { user: { userId: string; role?: string } },
  ) {
    return this.eventService.updateEvent(
      id,
      updateEventDto,
      req.user.userId,
      req.user.role || 'USER',
    );
  }

  @Patch(':id/publish')
  @UseGuards(AuthGuard('jwt'))
  async publish(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { userId: string; role?: string } },
  ) {
    return this.eventService.publishEvent(
      id,
      req.user.userId,
      req.user.role || 'USER',
    );
  }

  @Patch(':id/cancel')
  @UseGuards(AuthGuard('jwt'))
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { userId: string; role?: string } },
  ) {
    return this.eventService.cancel(
      id,
      req.user.userId,
      req.user.role || 'USER',
    );
  }

  @Get()
  async findAll() {
    return this.eventService.findAllEvents();
  }

  @Get('my-events')
  @UseGuards(AuthGuard('jwt'))
  async findMyEvent(
    @Request() req: { user: { userId: string; role?: string } },
  ) {
    return this.eventService.findMyEvents(req.user.userId);
  }
}
