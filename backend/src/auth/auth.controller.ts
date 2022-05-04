import {
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SkipAuth } from 'src/skipAuth.guard';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './fortyTwoAuth.guard';
import { LocalAuthGuard } from './localAuth.guard';
import { RequestWithUser } from './requestWithUser.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {} // add readonly?

  @SkipAuth()
  @UseGuards(FortyTwoAuthGuard)
  @Get()
  async fortyTwoAuth(@Request() req: RequestWithUser) {}

  @SkipAuth()
  @UseGuards(FortyTwoAuthGuard)
  @Get('42/callback')
  fortyTwoAuthRedirect(@Request() req: RequestWithUser) {
    //return this.authService.register(req);
  }

  @HttpCode(200) // NestJS responds with 201 Created for POST requests by default
  @SkipAuth()
  @UseGuards(LocalAuthGuard) // pass through LocalStrategy
  @Post('login')
  // Passport automatically creates a user object, based on the value we return
  // from the validate() method, and assigns it to the Request object as req.user
  async login(@Request() req: RequestWithUser) {
    console.log('AuthController: POST /auth/login');
    return this.authService.login(req.user);
  }
}
