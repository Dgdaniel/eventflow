import { Body, Controller, Get, Post, Headers, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from '@app/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    registerUser(@Body() body: RegisterDto) {
        return this.authService.registerUser(body.email, body.password, body.name)
    }

    @Post('login')
    loginUser(@Body() body: LoginDto) {
        return this.authService.loginUser(body.email, body.password)
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    async getProfile(@Headers('authorization') authorization: string) {
        
        return this.authService.getProfile(authorization)
    }
}
