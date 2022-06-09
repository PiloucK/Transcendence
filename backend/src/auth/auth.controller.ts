import {
  Controller,
  Get,
  Param,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './guards/fortyTwoAuth.guard';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/user.entity';
import { GetReqUser } from './decorators/getReqUser.decorator';
import { FortyTwoAuthFilter } from './filters/fortyTwoAuth.filter';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
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
  @UseFilters(FortyTwoAuthFilter)
  @Get('42/callback')
  fortyTwoAuthRedirect(
    @GetReqUser() reqUser: User,
    @Res() response: Response,
  ): void {
    // Passport assigns the User object returned by the validate() method to the
    // Request object, as request.user
    const jwtToken = this.authService.issueJwtToken(reqUser.login42);
    const cookie = this.authService.getAccessTokenCookie(jwtToken);
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
  ): void {
    const jwtToken = this.authService.issueJwtToken(login42);
    const cookie = this.authService.getAccessTokenCookie(jwtToken);
    response.setHeader('Set-Cookie', cookie);
    response.send(login42); // "return login42;" doesn't work
  }

  @UseGuards(JwtAuthGuard)
  @Get('getLoggedInUser')
  getLoggedInUser(@GetReqUser() user: User): Promise<User> {
    return this.usersService.getUserByLogin42(user.login42); // 2FA: a voir avec le JwtAuthGuard qui fait le fetch dans la database
  }
}
