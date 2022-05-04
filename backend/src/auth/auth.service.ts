import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  // called by the validate() method in LocalStrategy class
  async validateUser(login42: string): Promise<any> {
    const user = await this.usersService.getUserByLogin(login42);
    if (user) {
      console.log('validateUser: user found');
      return user;
    }
    console.log('validateUser: user not found');
    return null;
  }
}
