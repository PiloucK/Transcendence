import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtTokenPayloadDto } from '../dto/jwtTokenPayload.dto';

@Injectable()
export class JwtSingleFactorStrategy extends PassportStrategy(
  Strategy,
  'jwt-single-factor',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.transcendence_accessToken;
        },
      ]),
      secretOrKey: configService.get('JWT_ACCESSTOKEN_SECRET'),
    });
  }
  async validate(payload: JwtTokenPayloadDto) {
    return { login42: payload.login42 };
  }
}
