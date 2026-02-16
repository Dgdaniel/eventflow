import { KAFKA_SERVICE } from '@app/kafka';
import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { DatabaseService, events, tickets, ticketStatusEnum, users } from '@app/database';
import { randomBytes } from 'node:crypto';
import { PurchaseTicketDto } from '@app/common';
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

      this.kafkaClient.emit(KAFKA_TOPICS.TICKET_PURCHASED,  {
        ticketId: insertedTicket.id,
        eventId: insertedTicket.eventId,
        userId: insertedTicket.userId,
        quantity: insertedTicket.quantity,
        totalPrice: totalPrice,
        ticketCode: ticketCode,
        timestamp: new Date().toISOString(),

      })

      return {
        message : "Ticket purchased successfully",
        ticket : {
          id: insertedTicket.id,
          ticketCode: ticketCode,
          eventTitle: event.title,
          quantity: insertedTicket.quantity,
          totalPrice: totalPrice,
          status: insertedTicket.status,
          purchaseAt : new Date().toISOString()
        }
      }




  }

  async findMyTicket(userId: string) {
    const  uTickeets = await this.dbService.db
    .select(
      {
        id : tickets.id,
        ticketCode : tickets.ticketCode,
        quantity : tickets.quantity
        

      }
    )
    .from(tickets)
    .innerJoin(events, eq(tickets.eventId, events.id))
    .where(eq(tickets?userId, userId))
  }
}
