import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtTokenPayloadDto } from '../dto/jwtTokenPayload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.transcendence_accessToken;
        },
      ]),
      secretOrKey: configService.get('JWT_ACCESSTOKEN_SECRET'),
    });
  }

  async validate(payload: JwtTokenPayloadDto): Promise<User> {
    const user = await this.usersService.getUserByLogin42(payload.login42);
    if (!user.isTwoFactorAuthEnabled || payload.isTwoFactorAuthenticated) {
      return user;
    }
  }
}
