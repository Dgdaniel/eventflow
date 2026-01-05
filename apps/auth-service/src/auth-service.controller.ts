import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto, RegisterDto } from '@app/common';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @Post('register')
  registerUser(@Body() body: RegisterDto) {
    return this.authServiceService.registerUser(body.email, body.password, body.name)
  }

  @Post('login')
  loginUser(@Body() body: LoginDto) {
    return this.authServiceService.login(body.email, body.password)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req: {user: {userId: string}}) {
   
    return this.authServiceService.getProfile(req.user.userId)

  }

}
