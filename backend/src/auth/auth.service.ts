import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async findOrCreate42UserInDatabase(login42: string): Promise<User> {
    return await this.usersService.createUser({ login42 });
  }

  issueJwtToken(login42: string, isSecondFactorAuthenticated = false): string {
    const payload = { login42, isSecondFactorAuthenticated };
    return this.jwtService.sign(payload);
  }

  getAccessTokenCookie(token: string): string {
    return `${this.configService.get(
      'ACCESSTOKEN_COOKIE_NAME',
    )}=${token}; Path=${this.configService.get(
      'ACCESSTOKEN_COOKIE_PATH',
    )}; Max-Age=${this.configService.get('JWT_ACCESSTOKEN_EXPIRATION_TIME')}`;
  }
}
