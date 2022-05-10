import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { SkipJwtAuth } from 'src/skipJwtAuth.guard';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './guards/fortyTwoAuth.guard';
import { RequestWithUser } from './interfaces/requestWithUser.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipJwtAuth()
  @UseGuards(FortyTwoAuthGuard) // pass through FortyTwoStrategy
  @Get()
  fortyTwoAuth(): void {
    console.log(
      'will never reach this (redirected to /auth/42/callback within FortyTwoAuthGuard)',
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
    response.cookie('Authentication', jwtToken, {
      sameSite: 'strict', // in .env?
      path: '/', // idem
      maxAge: 86400, // in devtools->Storage: Expires / Max-Age:"Session"
      // Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}
    });
  }
  // if (req.user.enableTwoFactorAuth === false) {
  //   res.cookie('two_factor_auth', true, {
  //     httpOnly: false,
  //   });

  @Get('getLoggedInUser')
  getLoggedInUser(@Req() request: RequestWithUser) {
    return request.user;
  }
}
