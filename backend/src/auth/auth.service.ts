import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService, // readonly? https://wanago.io/2020/05/25/api-nestjs-authenticating-users-bcrypt-passport-jwt-cookies/
    private readonly jwtService: JwtService, // readonly? https://github.com/nestjs/jwt/blob/master/README.md#usage
  ) {}

  async findOrCreate42UserInDatabase(login42: string): Promise<User> {
    return await this.usersService.createUser({ login42 });
  }

  issueJwtToken(login42: string): string {
    const payload = { login42 };
    return this.jwtService.sign(payload);
    // this sign() function comes from the @nestjs/jwt library
  }

  getCookieWithJwtToken(jwtToken: string) {
    return `Authentication=${jwtToken}; SameSite=Strict; Path=/; Max-Age=86400`;
    // Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}

    // Cookie “Authentication” will be soon rejected because it has the “SameSite” attribute set to “None” or an invalid value, without the “secure” attribute. To know more about the “SameSite“ attribute, read https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie/SameSite
  }
  // https://wanago.io/2020/09/21/api-nestjs-refresh-tokens-jwt/
}
