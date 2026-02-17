import { KAFKA_SERVICE } from '@app/kafka';
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { DatabaseService, events, tickets, ticketStatusEnum, users } from '@app/database';
import { randomBytes } from 'node:crypto';
import { CheckInTicketDto, PurchaseTicketDto } from '@app/common';
import { and, eq, sql } from 'drizzle-orm';
import { KAFKA_TOPICS } from '@app/kafka/constants/kafka.constant';
import { timestamp } from 'drizzle-orm/gel-core';

@Injectable()
export class TicketsServiceService implements OnModuleInit {

  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
    private readonly dbService: DatabaseService,
  ) { }

  async onModuleInit() {
    console.log('Tickets Service is running');
    await this.kafkaClient.connect();

  }

  private async generateTicketCode(): Promise<string> {
    return randomBytes(16).toString('hex').toUpperCase();
  }

  async purchase(purchaseDto: PurchaseTicketDto, userId: string) {
    const { eventId, quantity } = purchaseDto;
    const [event] = await this.dbService.db
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (event.status !== "PUBLISHED") {
      throw new Error("Event is not published");
    }

    const soldTikcet = await this.dbService.db
      .select({ total: sql<number>`COALESC(count(SUM(${tickets.quantity})), 0)` })
      .from(tickets)
      .where(
        and(
          eq(tickets.eventId, eventId),
          eq(tickets.status, 'CONFIRMED')
        )
      );

    const currentSold = Number(soldTikcet[0]?.total);
    const remaining = event.capacity - currentSold;

    if (quantity > remaining) {
      throw new BadRequestException(`Only ${remaining} tickets remaing`);
    }
    const totalPrice = event.price * quantity;

    // Avoid shadowing the imported 'tickets' table
    const ticketCode = await this.generateTicketCode();
    const [insertedTicket] = await this.dbService.db
      .insert(tickets)
      .values({
        eventId,
        userId,
        quantity,
        totalPrice,
        status: 'CONFIRMED',
        ticketCode,
      })
      .returning();

    this.kafkaClient.emit(KAFKA_TOPICS.TICKET_PURCHASED, {
      ticketId: insertedTicket.id,
      eventId: insertedTicket.eventId,
      userId: insertedTicket.userId,
      quantity: insertedTicket.quantity,
      totalPrice: totalPrice,
      ticketCode: ticketCode,
      timestamp: new Date().toISOString(),

    })

    return {
      message: "Ticket purchased successfully",
      ticket: {
        id: insertedTicket.id,
        ticketCode: ticketCode,
        eventTitle: event.title,
        quantity: insertedTicket.quantity,
        totalPrice: totalPrice,
        status: insertedTicket.status,
        purchaseAt: new Date().toISOString()
      }
    }




  }

  async findMyTicket(userId: string) {
    const uTickeets = await this.dbService.db
      .select(
        {
          id: tickets.id,
          ticketCode: tickets.ticketCode,
          quantity: tickets.quantity,
          totalPrice: tickets.totalPrice,
          status: tickets.status,
          purchasedAt: tickets.purchasedAt,
          eventTitle: events.title,
        }
      )
      .from(tickets)
      .innerJoin(events, eq(tickets.eventId, events.id))
      .where(eq(tickets.userId, userId))
  }

  async checkIn(ticketCode: string, organizerId: string) {
    const [foundTickets] = await this.dbService.db.select(
      {
        id: tickets.id,
        status: tickets.status,
        eventId: tickets.eventId,
        quantity: tickets.quantity,
      }
    ).from(tickets)
      .where(eq(tickets.ticketCode, ticketCode))
      .limit(1);

    if (!foundTickets) {
      throw new NotFoundException("Ticket not found")
    }

    const [event] = await this.dbService.db
      .select()
      .from(events)
      .where(eq(events.id, foundTickets.id))


    if (event.organizerId !== organizerId)
      throw new ForbiddenException("You are not authorized to check in this ticket")


    if (foundTickets.status === "CANCELED") {
      throw new BadRequestException('Ticket has been already cancelled')
    }

    if (foundTickets.status === "CHECKED_IN") {
      throw new BadRequestException('Ticket has been already checked in')

    }

    const [checkedIn] = await this.dbService.db
      .update(tickets)
      .set({
        status: "CHECKED_IN",
        checkedInAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(tickets.id, foundTickets.id))
      .returning();


    this.kafkaClient.emit(KAFKA_TOPICS.TICKET_CHECKED_IN, {
      ticketId: foundTickets.id,
      eventId: foundTickets.eventId,
      userId: checkedIn.userId,
      ticketCode: checkedIn.ticketCode,
      timestamp: new Date().toISOString()
    })

    return {
      message: "Ticket checked in successfully ",
      ticket: {
        id: checkedIn.id,
        ticketCode: checkedIn.ticketCode,
        quantity: checkedIn.quantity,
        status: checkedIn.status,
        checkedInAt: checkedIn.checkedInAt,
      }
    }
  }

  async findEventTickets(eventId: string, organizerId: string) {
    const [event] = await this.dbService.db
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (!event) {
      throw new NotFoundException("Event not found")
    }

    if (event.organizerId !== organizerId) {
      throw new ForbiddenException("You are not authorized to view tickets of this event")
    }

    return await this.dbService.db
      .select()
      .from(tickets)
      .where(eq(tickets.eventId, eventId));
  }

  async cancelTicket(ticketId: string, userId: string) {
    const [ticket] = await this.dbService.db
      .select()
      .from(tickets)
      .where(eq(tickets.id, ticketId))
      .limit(1);

    if (!ticket) {
      throw new NotFoundException("Ticket not found")
    }

    if (ticket.userId !== userId) {
      throw new ForbiddenException("You are not authorized to cancel this ticket")
    }

    if (ticket.status === "CANCELED") {
      throw new BadRequestException('Ticket has been already cancelled')
    }

    const [canceledTicket] = await this.dbService.db
      .update(tickets)
      .set({
        status: "CANCELED",
        updatedAt: new Date(),
      })
      .where(eq(tickets.id, ticketId))
      .returning();

    this.kafkaClient.emit(KAFKA_TOPICS.TICKET_CANCELLED, {
      ticketId: canceledTicket.id,
      eventId: canceledTicket.eventId,
      userId: canceledTicket.userId,
      ticketCode: canceledTicket.ticketCode,
      timestamp: new Date().toISOString()
    })

    return {
      message: "Ticket canceled successfully ",
      ticket: {
        id: canceledTicket.id,
        ticketCode: canceledTicket.ticketCode,
        quantity: canceledTicket.quantity,
        status: canceledTicket.status,
        updatedAt: canceledTicket.updatedAt,
      }
    }
  }

}
