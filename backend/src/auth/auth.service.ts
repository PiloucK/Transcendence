import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService, // readonly? https://github.com/nestjs/jwt/blob/master/README.md#usage
  ) {}

  // called by the validate() method in LocalStrategy class
  async validateUser(login42: string): Promise<any> {
    const user = await this.usersService.getUserByLogin(login42);
    if (user) {
      console.log('AuthService: validateUser: user found');
      return user;
    }
    console.log('AuthService: validateUser: user not found');
    return null;
  }

  async login(user: any) {
    const payload = { login42: user.login42 };
    console.log('AuthService: login: user.login42 = ', user.login42);
    return {
      accessToken: this.jwtService.sign(payload),
    }; // sign() function from the @nestjs/jwt library
  }

  async register(login42: string) {
    try {
      const user = await this.usersService.getUserByLogin(login42);
      return user;
    } catch (error: any) {
      // no any
      if (error.status === 404) {
        this.usersService.createUser({ login42 });
      }
    }
    return null;
  }
}
