import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard) // pass through LocalStrategy
  @Post('login')
  // Passport automatically creates a user object, based on the value we return
  // from the validate() method, and assigns it to the Request object as req.user
  async login(@Request() req: any) {
    return req.user;
  }
}
