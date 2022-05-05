import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService, // readonly? https://github.com/nestjs/jwt/blob/master/README.md#usage
  ) {}

  async findOrCreate42UserInDatabase(login42: string) {
    return await this.usersService.createUser({ login42 });
  }

  async issueJwtToken(login42: string) {
    const payload = { login42 };
    return {
      accessToken: this.jwtService.sign(payload),
    }; // sign() function from the @nestjs/jwt library
  }
}
