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

  async generateTwoFactorAuthSecret(reqUser: ReqUser) {
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

    return otpauthUrl;
  }

  getQrCodeDataUrl(otpauthUrl: string) {
    return qrcode.toDataURL(otpauthUrl);
  }

  async isFirstTwoFactorAuthCodeValid(
    firstAuthCode: string | undefined,
    reqUser: ReqUser,
  ): Promise<boolean> {
    const user = await this.usersService.getUserByLogin42(reqUser.login42);
    //console.log('enabled:', user.isTwoFactorAuthEnabled);

    if (firstAuthCode) {
      return authenticator.verify({
        token: firstAuthCode,
        secret: user.twoFactorAuthTemporarySecret,
      });
    } else if (user.twoFactorAuthSecret) {
      return true;
    } else {
      return false;
    }
  }

  async isTwoFactorAuthCodeValid(
    authCode: string,
    reqUser: ReqUser,
  ): Promise<boolean> {
    const user = await this.usersService.getUserByLogin42(reqUser.login42);
    return authenticator.verify({
      token: authCode,
      secret: user.twoFactorAuthSecret,
    });
  }
}
