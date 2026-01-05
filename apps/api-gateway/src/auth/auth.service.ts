import { HttpException, Injectable } from '@nestjs/common';
import { SERVICE_PORT } from '@app/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';

@Injectable()
export class AuthService {
  private readonly authServiceUrl = `http://localhost:${SERVICE_PORT.AUTH_SERVICE}`;

  constructor(private readonly httpService: HttpService) {}

  async registerUser(email: string, password: string, name: string) {
    try {
      const response = await this.httpService.axiosRef.post(
        `${this.authServiceUrl}/register`,
        { email, password, name },
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleError(error);
      }
      throw error;
    }
  }

  async loginUser(email: string, password: string) {
    try {
      const response = await this.httpService.axiosRef.post(
        `${this.authServiceUrl}/login`,
        { email, password },
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleError(error);
      }
      throw error;
    }
  }

  async getProfile(token: string) {
    try {
      const response = await this.httpService.axiosRef.get(
        `${this.authServiceUrl}/profile`,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.handleError(error);
      }
      throw error;
    }
  }

  private handleError(error: AxiosError) {
    if (error.response) {
      throw new HttpException(
        (error.response.data as any).message || error.message,
        error.response.status,
      );
    }
    throw new HttpException(error.message, 503);
  }
}
