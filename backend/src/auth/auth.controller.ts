import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { SkipAuth } from 'src/skipAuth.guard';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './localAuth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @UseGuards(LocalAuthGuard) // pass through LocalStrategy
  @Post('login')
  // Passport automatically creates a user object, based on the value we return
  // from the validate() method, and assigns it to the Request object as req.user
  async login(@Request() req: any) {
    console.log('AuthController: POST /auth/login');
    return this.authService.login(req.user);
  }
}
