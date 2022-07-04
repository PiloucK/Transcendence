import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { User } from 'src/users/user.entity';
import { AuthService } from '../auth.service';
import { FortyTwoUserProfileDto } from '../dto/fortyTwoUserProfile.dto';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get('FORTYTWO_APP_CLIENT_ID'),
      clientSecret: configService.get('FORTYTWO_APP_CLIENT_SECRET'),
      callbackURL: configService.get('FORTYTWO_APP_REDIRECT_URI'),
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: FortyTwoUserProfileDto,
  ): Promise<User> {
    return this.authService.findOrCreate42UserInDatabase(profile);
  }
}
