import { HttpException, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { HttpService } from "@nestjs/axios";
import { PurchaseTicketDto, SERVICE_PORT } from "@app/common";
import { firstValueFrom } from "rxjs";

@Injectable()
export class TicketsService {

    private readonly ticketService = `http://localhost:${SERVICE_PORT.TICKETS_SERVICE}/tickets`;

    constructor(
        private readonly httpService: HttpService
    ) { }

    async purchaseTicket(purchaseDto: PurchaseTicketDto, userId: string) {
        try {
            const response = await firstValueFrom(this.httpService.post(`${this.ticketService}/purchase`, purchaseDto, {
                headers: {
                    'x-user-id': userId,

                }
            }));
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async cancelTicket(ticketId: string, userId: string) {
        try {
            const response = await firstValueFrom(this.httpService.post(`${this.ticketService}/${ticketId}/cancel`, {}, {
                headers: {
                    'x-user-id': userId,
                }
            }));
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async validateTicket(ticketId: string, userId: string) {
        try {
            const response = await firstValueFrom(this.httpService.post(`${this.ticketService}/${ticketId}/validate`, {}, {
                headers: {
                    'x-user-id': userId,
                }
            }));
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async findEventTickets(eventId: string, userId: string) {
        try {
            const response = await firstValueFrom(this.httpService.get(`${this.ticketService}/events/${eventId}`, {
                headers: {
                    'x-user-id': userId,
                }
            }));
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async findMyTickets(userId: string) {
        try {
            const response = await firstValueFrom(this.httpService.get(`${this.ticketService}/my-tickets`, {
                headers: {
                    'x-user-id': userId,
                }
            }));
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async findOne(ticketId: string, userId: string) {
        try {
            const response = await firstValueFrom(this.httpService.get(`${this.ticketService}/${ticketId}`, {
                headers: {
                    'x-user-id': userId,
                }
            }));
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: unknown) {
        const err = error as {
            response?: { data: string | object; status: number };
        };
        if (err.response) {
            throw new HttpException(err.response.data, err.response.status);
        }
        throw new HttpException('Something went wrong', 500);
    }
}