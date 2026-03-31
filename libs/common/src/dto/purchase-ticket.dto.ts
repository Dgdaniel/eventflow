import { IsNumber, IsUUID, Max, Min } from 'class-validator';

export class PurchaseTicketDto {
  @IsUUID()
  eventId: string;
  @IsNumber()
  @Min(1)
  @Max(10)
  quantity: number;
}
