import { HttpException, Injectable } from '@nestjs/common';
import { SERVICE_PORT } from '@app/common';
import { AuthServiceService } from 'apps/auth-service/src/auth-service.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {

    private readonly authServiceUrl = `http://localhost:${SERVICE_PORT.AUTH_SERVICE}`;

    constructor(private readonly httpService: HttpService) {

    }

    async registerUser(email: string, password: string, name: string) {

        try {
            const response = await this.httpService.post(`${this.authServiceUrl}/register`, { email, password, name });
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    async loginUser(email: string, password: string) {
        try {
            const response = await this.httpService.post(`${this.authServiceUrl}/login`, { email, password });
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getProfile(token: string) {
        try {
            const response = await this.httpService.get(`${this.authServiceUrl}/profile`, {
                headers: {
                    Authorization: `${token}`
                }
            });
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    private async handleError(error: any) {
        if (error.response) {
            throw new HttpException(error.response.data.message, error.response.status);
        }
        //   throw new HttpException(error.message, 503);
    }
}
