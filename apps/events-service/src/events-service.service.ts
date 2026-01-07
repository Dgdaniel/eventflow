import { CreateEventDto, UpdateEventDto } from '@app/common';
import { DatabaseService } from '@app/database';
import { KAFKA_SERVICE } from '@app/kafka';
import { KAFKA_TOPICS } from '@app/kafka/constants/kafka.constant';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { events } from '@app/database';
import { eq } from 'drizzle-orm';

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
      title: newEvent.title,
      organizerId: newEvent.organizerId,
      timestamp: new Date().toISOString(),
    });
    return newEvent;
  }

  async findAll() {
    return this.dbservice.db.
      select()
      .from(events)
      .where(eq(events.status, "PUBLISHED"));
  }

  async findOne(id: string) {
    const [event] = await this.dbservice.db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1);

    if (!event) {
      throw new Error("Event not found");
    }
    return event;
  }

  async update(id: string, updatedEvent: UpdateEventDto, userId: string, userRole: string) {
    const event = await this.findOne(id);


    if (event.organizerId !== userId && userRole !== "ADMIN") {
      throw new Error("You are not authorized to update this event");
    }
    const updatedData: Record<string, any> = { ...updatedEvent };
    if (updatedEvent.date) {
      updatedData.date = new Date(updatedEvent.date);
    }
    updatedData.updatedAt = new Date();
    const [updated] = await this.dbservice.db.update(events)
      .set(updatedData)
      .where(eq(events.id, id))
      .returning();

    if (!updated) {
      throw new Error("Event not found");
    }
    this.kafkaClient.emit(KAFKA_TOPICS.EVENT_UPDATED, {
      eventId: updated.id,
      changes: Object.keys(updatedEvent),
      timestamp: new Date().toISOString(),
    });
    return updated;
  }

  async publishEvent(id: string, userId: string, userRole: string) {
    const event = await this.findOne(id);
    if (!event) {
      throw new Error("Event not found");
    }
    if (event.organizerId !== userId && userRole !== "ADMIN") {
      throw new Error("You are not authorized to publish this event");
    }
    const [updated] = await this.dbservice.db.update(events)
      .set({ status: "PUBLISHED", updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();

    return updated;
  }

  async cancel(id: string, userId: string, userRole: string) {
    const event = await this.findOne(id);
    if (!event) {
      throw new Error("Event not found");
    }
    if (event.organizerId !== userId && userRole !== "ADMIN") {
      throw new Error("You are not authorized to cancel this event");
    }
    const [cancelled] = await this.dbservice.db.update(events)
      .set({ status: "CANCELLED", updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();

    this.kafkaClient.emit(KAFKA_TOPICS.EVENT_DELETED, {
      eventId: cancelled.id,
      organizerId: cancelled.organizerId,
      timestamp: new Date().toISOString(),
    });

    return cancelled;
  }

  async findMyEvents(organizerId: string) {
    return await this.dbservice.db
      .select()
      .from(events)
      .where(eq(events.organizerId, organizerId));
  }
}
