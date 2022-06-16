import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { FortyTwoUserProfileDto } from './dto/fortyTwoUserProfile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async findOrCreate42UserInDatabase(fortyTwoUserProfileDto: FortyTwoUserProfileDto): Promise<User> {
    return await this.usersService.createUser({login42: fortyTwoUserProfileDto.username, photo42: fortyTwoUserProfileDto.photos[0].value});
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
