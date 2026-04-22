import { SERVICE_PORT } from '@app/common';
import { HttpService } from '@nestjs/axios';
import { HttpException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventService {
  private readonly eventServiceUrl = `http://localhost:${SERVICE_PORT.EVENTS_SERVICE}`;
  constructor(private readonly httpService: HttpService) {}

  async createEvent(
    data: object,
    userId: string,
    userRole: string,
  ): Promise<unknown> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.eventServiceUrl}/events`, data, {
          headers: {
            'x-user-id': userId,
            'x-user-role': userRole,
          },
        }),
      );
      return response.data as unknown;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAllEvents(): Promise<unknown> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.eventServiceUrl}/events`),
      );
      return response.data as unknown;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findMyEvents(userId: string): Promise<unknown> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.eventServiceUrl}/events/my-events`, {
          headers: {
            'x-user-id': userId,
          },
        }),
      );
      return response.data as unknown;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOneEvent(id: string): Promise<unknown> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.eventServiceUrl}/events/${id}`),
      );
      return response.data as unknown;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateEvent(
    id: string,
    data: object,
    userId: string,
    userRole: string,
  ): Promise<unknown> {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.eventServiceUrl}/events/${id}`, data, {
          headers: {
            'x-user-id': userId,
            'x-user-role': userRole,
          },
        }),
      );
      return response.data as unknown;
    } catch (error) {
      this.handleError(error);
    }
  }

  async publishEvent(
    id: string,
    userId: string,
    userRole: string,
  ): Promise<unknown> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.eventServiceUrl}/events/${id}/publish`,
          {},
          {
            headers: {
              'x-user-id': userId,
              'x-user-role': userRole,
            },
          },
        ),
      );
      return response.data as unknown;
    } catch (error) {
      this.handleError(error);
    }
  }

  async cancel(id: string, userId: string, userRole: string): Promise<unknown> {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.eventServiceUrl}/events/${id}/cancel`, {
          headers: {
            'x-user-id': userId,
            'x-user-role': userRole,
          },
        }),
      );
      return response.data as unknown;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown): never {
    const err = error as {
      response?: { data: string | object; status: number };
    };
    if (err.response) {
      throw new HttpException(err.response.data, err.response.status);
    }
    throw new HttpException('Something went wrong', 500);
  }
}
