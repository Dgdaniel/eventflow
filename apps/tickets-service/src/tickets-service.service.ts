import { KAFKA_SERVICE } from '@app/kafka';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { DatabaseService, events } from '@app/database';
import { randomBytes } from 'node:crypto';
import { PurchaseTicketDto } from '@app/common';
import { eq } from 'drizzle-orm';

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
    const [event] = this.dbService.db
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (event.status !== "PUBLISHED") {
      throw new Error("Event is not published");
    }



  }

  getHello(): string {
    return 'Hello World!';
  }
}
