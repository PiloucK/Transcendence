import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID:
        '9fd30dbda5494d34c21cab03ca64107947c5e629111d679ec2bea285f15e48f5',
      clientSecret:
        '25ea85c8df48e3d138ed3a76eede1c1f90e2275106fc2a14044844b911a15804',
      callbackURL: 'http://0.0.0.0:3001/auth/42/callback',
      // clientID: configService.get<string>('42_APP_CLIENT_ID'),
      // clientSecret: configService.get<string>('42_APP_CLIENT_SECRET'),
      // callbackURL: configService.get<string>('42_APP_CALLBACK_URL'),
      // `${process.env.HOST}:${process.env.PORT}/auth/redirect`
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any, // no any
  ): Promise<User> {
    return this.authService.findOrCreate42UserInDatabase(profile.username);
  }
}
