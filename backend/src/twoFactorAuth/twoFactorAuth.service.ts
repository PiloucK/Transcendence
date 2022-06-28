import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtSingleFactorReqUser } from './jwtSingleFactorReqUser.interface';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  generateSecret(reqUser: User) {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(
      reqUser.login42,
      `${this.configService.get('TWO_FACTOR_AUTH_APP_NAME')}`,
      secret,
    );

    this.usersService.setTwoFactorAuthTemporarySecret(secret, reqUser);
    return otpauthUrl;
  }

  getQrCodeDataUrl(otpauthUrl: string) {
    return qrcode.toDataURL(otpauthUrl);
  }

  async isFirstCodeValid(
    authCode: string | undefined,
    reqUser: User,
  ): Promise<boolean> {
    if (authCode) {
      return authenticator.verify({
        token: authCode,
        secret: reqUser.twoFactorAuthTemporarySecret,
      });
    } else if (reqUser.twoFactorAuthSecret) {
      return true;
    } else {
      return false;
    }
  }

  async isCodeValid(
    authCode: string,
    reqUser: JwtSingleFactorReqUser,
  ): Promise<boolean> {
    const user = await this.usersService.getUserByLogin42(reqUser.login42);
    return authenticator.verify({
      token: authCode,
      secret: user.twoFactorAuthSecret,
    });
  }
}
