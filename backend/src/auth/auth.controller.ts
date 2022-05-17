import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './guards/fortyTwoAuth.guard';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/user.entity';
import { GetReqUser } from './getReqUser.decorator';

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
  fortyTwoAuthRedirect(@GetReqUser() reqUser: User, @Res() response: Response) {
    // Passport assigns the User object returned by the validate() method to the
    // Request object, as request.user
    const jwtToken = this.authService.issueJwtToken(reqUser.login42);
    // response.cookie(
    //   `${this.configService.get('ACCESSTOKEN_COOKIE_NAME')}`,
    //   jwtToken,
    //   {
    //     sameSite: this.configService.get('ACCESSTOKEN_COOKIE_SAMESITE'),
    //     path: this.configService.get('ACCESSTOKEN_COOKIE_PATH'),
    //     maxAge: 3600, // in devtools->Storage: Expires / Max-Age:"Session"
    //     // Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}
    //   },
    // );
    const cookie = `${this.configService.get(
      'ACCESSTOKEN_COOKIE_NAME',
    )}=${jwtToken}; SameSite=Strict; Path=/; Max-Age=3600`;
    response.setHeader('Set-Cookie', cookie);
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

  // dev
  @Get('getToken/:login42')
  getTokenForUser(
    @Param('login42') login42: string,
    @Res() response: Response,
  ) {
    const jwtToken = this.authService.issueJwtToken(login42);
    response.cookie(
      `${this.configService.get('ACCESSTOKEN_COOKIE_NAME')}`,
      jwtToken,
      {
        sameSite: this.configService.get('ACCESSTOKEN_COOKIE_SAMESITE'),
        path: this.configService.get('ACCESSTOKEN_COOKIE_PATH'),
        maxAge: 86400,
      },
    );

    return response.send(login42);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getLoggedInUser')
  getLoggedInUser(@GetReqUser() user: User) {
    return user;
  }
}
