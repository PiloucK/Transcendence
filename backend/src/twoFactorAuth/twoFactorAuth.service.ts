import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import { ReqUser } from 'src/reqUser.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async generateSecret(reqUser: ReqUser) {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(
      reqUser.login42,
      `${this.configService.get('TWO_FACTOR_AUTH_APP_NAME')}`,
      secret,
    );

    await this.usersService.setTwoFactorAuthTemporarySecret(
      secret,
      reqUser.login42,
    );
    console.log('temporary secret', secret);

    return otpauthUrl;
  }

  getQrCodeDataUrl(otpauthUrl: string) {
    return qrcode.toDataURL(otpauthUrl);
  }

  async isFirstCodeValid(
    authCode: string | undefined,
    reqUser: ReqUser,
  ): Promise<boolean> {
    const user = await this.usersService.getUserByLogin42(reqUser.login42);
    console.log('enabled:', user.isTwoFactorAuthEnabled);
    console.log(
      'temporary secret',
      user.twoFactorAuthTemporarySecret,
      'authcode',
      authCode,
    );

    if (authCode) {
      return authenticator.verify({
        token: authCode,
        secret: user.twoFactorAuthTemporarySecret,
      });
    } else if (user.twoFactorAuthSecret) {
      return true;
    } else {
      return false;
    }
  }

  async isCodeValid(authCode: string, reqUser: ReqUser): Promise<boolean> {
    const user = await this.usersService.getUserByLogin42(reqUser.login42);
    return authenticator.verify({
      token: authCode,
      secret: user.twoFactorAuthSecret,
    });
  }
}
