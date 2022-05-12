import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './guards/fortyTwoAuth.guard';
import { RequestWithUser } from '../interfaces/requestWithUser.interface';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(FortyTwoAuthGuard) // pass through FortyTwoStrategy
  @Get()
  fortyTwoAuth(): void {
    console.log(
      'will never reach this (redirected to /auth/42/callback within FortyTwoAuthGuard)',
    );
    return;
  }

  @UseGuards(FortyTwoAuthGuard)
  @Get('42/callback')
  fortyTwoAuthRedirect(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    // Passport assigns the User object returned by the validate() method to the
    // Request object, as request.user
    const jwtToken = this.authService.issueJwtToken(request.user.login42);
    response.cookie(
      `${this.configService.get('ACCESSTOKEN_COOKIE_NAME')}`,
      jwtToken,
      {
        sameSite: this.configService.get('ACCESSTOKEN_COOKIE_SAMESITE'),
        path: this.configService.get('ACCESSTOKEN_COOKIE_PATH'),
        maxAge: 86400, // in devtools->Storage: Expires / Max-Age:"Session"
        // Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}
      },
    );
    response.redirect(
      `http://${this.configService.get('HOST')}:${this.configService.get(
        'FRONTEND_PORT',
      )}`,
    );
  }
  // if (req.user.enableTwoFactorAuth === false) {
  //   res.cookie('two_factor_auth', true, {
  //     httpOnly: false,
  //   });

  @UseGuards(JwtAuthGuard)
  @Get('getLoggedInUser')
  getLoggedInUser(@Req() request: RequestWithUser) {
    return request.user;
  }
}
