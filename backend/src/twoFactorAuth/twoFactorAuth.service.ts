import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { TwoFactorAuthCodeDto } from './dto/twoFactorAuthCode.dto';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async generateTwoFactorAuthSecret(user: User) {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(
      user.login42,
      `${this.configService.get('TWO_FACTOR_AUTH_APP_NAME')}`,
      secret,
    );

    await this.usersService.setTwoFactorAuthSecret(secret, user.login42);

    return otpauthUrl;
  }

  getQrCodeDataUrl(otpauthUrl: string) {
    return qrcode.toDataURL(otpauthUrl);
  }

  isTwoFactorAuthCodeValid(
    twoFactorAuthCodeDto: TwoFactorAuthCodeDto,
    user: User,
  ) {
    const { authCode } = twoFactorAuthCodeDto;

    return authenticator.verify({
      token: authCode,
      secret: user.twoFactorAuthSecret,
    });
  }
}
