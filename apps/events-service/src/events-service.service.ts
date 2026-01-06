import { CreateEventDto } from '@app/common';
import { DatabaseService } from '@app/database';
import { KAFKA_SERVICE } from '@app/kafka';
import { KAFKA_TOPICS } from '@app/kafka/constants/kafka.constant';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { events } from '@app/database';

@Injectable()
export class EventsServiceService implements OnModuleInit {

  constructor(@Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
    private readonly dbservice: DatabaseService,

  ) { }
  onModuleInit() {
    this.kafkaClient.connect();
  }

  async createEvent(event: CreateEventDto, organizerId: string) {
    const [newEvent] = await this.dbservice.db.insert(events).values({
      ...event,
      date: new Date(event.date),
      price: event.price || 0,
      organizerId,
      status: "DRAFT",
    }).returning();

    this.kafkaClient.emit(KAFKA_TOPICS.EVENT_CREATED, {
      eventId: newEvent.id,
      organizerId: newEvent.organizerId,

    });
    return newEvent;
  }
}
