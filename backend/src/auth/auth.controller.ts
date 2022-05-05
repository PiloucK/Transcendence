import { Controller, Get, Redirect, Request, UseGuards } from '@nestjs/common';
import { SkipJwtAuth } from 'src/skipJwtAuth.guard';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './fortyTwoAuth.guard';
import { RequestWithUser } from './requestWithUser.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {} // add readonly?

  @SkipJwtAuth()
  @UseGuards(FortyTwoAuthGuard)
  @Get()
  fortyTwoAuth() {
    console.log('will never pass here');
    return;
  }

  @SkipJwtAuth()
  @UseGuards(FortyTwoAuthGuard)
  //@Redirect()
  @Get('42/callback')
  fortyTwoAuthRedirect(@Request() req: RequestWithUser) {
    return this.authService.issueJwtToken(req.user.login42);
  }
}
