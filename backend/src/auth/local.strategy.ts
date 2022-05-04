import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  // Passport will call the verify function, implemented with this validate()
  // method, using an appropriate strategy-specific set of parameters
  async validate(username: string, password: string): Promise<any> {
    console.log('validate: username = ', username, 'password = ', password);

    const user = await this.authService.validateUser(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
