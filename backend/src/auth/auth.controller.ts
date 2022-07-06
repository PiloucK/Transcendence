import { Controller, Get, Res, UseFilters, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './guards/fortyTwoAuth.guard';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { ConfigService } from '@nestjs/config';
import { GetReqUser } from './decorators/getReqUser.decorator';
import { FortyTwoAuthFilter } from './filters/fortyTwoAuth.filter';
import { User } from 'src/users/user.entity';
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

  @UseGuards(JwtAuthGuard)
  @Get('getLoggedInUser')
  async getLoggedInUser(@GetReqUser() reqUser: User): Promise<User> {
    return await this.usersService.getUserWithAllRelations(reqUser.login42);
  }
}
