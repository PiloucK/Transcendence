import {
  Controller,
  Get,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { SkipJwtAuth } from 'src/skipJwtAuth.guard';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './fortyTwoAuth.guard';
import { RequestWithUser } from './requestWithUser.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {} // add readonly?

  @SkipJwtAuth() // remove this? if a user is already logged on, do not query 42 api...
  // "Verifying tokens" on https://wanago.io/2020/05/25/api-nestjs-authenticating-users-bcrypt-passport-jwt-cookies/
  @UseGuards(FortyTwoAuthGuard) // pass through FortyTwoStrategy
  @Get()
  fortyTwoAuth(): void {
    console.log(
      'will never pass here (redirected to /auth/42/callback within FortyTwoAuthGuard)',
    );
    return;
  }

  @SkipJwtAuth()
  @UseGuards(FortyTwoAuthGuard)
  //@Redirect()
  @Get('42/callback')
  fortyTwoAuthRedirect(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    // Passport assigns the User object returned by the validate() method to the
    // Request object, as request.user
    const jwtToken = this.authService.issueJwtToken(request.user.login42);
    const cookie = this.authService.getCookieWithJwtToken(jwtToken);
    response.setHeader('Set-Cookie', cookie);
    return response.send(request.user); // cannot write return request.user?
  }

  //@HttpCode(200)
  @Post('logout') // why POST
  logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    const cookie = this.authService.getCookieForLogOut();
    response.setHeader('Set-Cookie', cookie);
    return response.sendStatus(200);
  }
}
