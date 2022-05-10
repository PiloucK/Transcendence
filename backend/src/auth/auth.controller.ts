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
  constructor(private readonly authService: AuthService) {} // add readonly?

  @SkipJwtAuth()
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
  @Redirect('http://0.0.0.0:3000') // `${process.env.HOST}:${process.env.CLIENT_PORT}`
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
  }
  // res.cookie('access_token', token.access_token, {
  //   httpOnly: false,
  // });
  // if (req.user.enableTwoFactorAuth === false) {
  //   res.cookie('two_factor_auth', true, {
  //     httpOnly: false,
  //   });
  // }
  // res.status(302).redirect(`${process.env.HOST}:${process.env.CLIENT_PORT}`);

  @Get('getLoggedInUser')
  getLoggedInUser(@Req() request: RequestWithUser) {
    return request.user;
  }
}
