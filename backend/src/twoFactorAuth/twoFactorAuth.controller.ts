import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { GetReqUser } from 'src/auth/decorators/getReqUser.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { ReqUser } from 'src/reqUser.interface';
import { UsersService } from 'src/users/users.service';
import { TwoFactorAuthCodeDto } from './dto/twoFactorAuthCode.dto';
import { TwoFactorAuthService } from './twoFactorAuth.service';

@Controller('two-factor-auth')
export class TwoFactorAuthController {
  constructor(
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('generate-qrcode')
  @UseGuards(JwtAuthGuard)
  async generateQrCode(
    @GetReqUser() reqUser: ReqUser,
    @Res() response: Response,
  ) {
    const otpauthUrl =
      await this.twoFactorAuthService.generateTwoFactorAuthSecret(reqUser);

    const qrcodeDataUrl = await this.twoFactorAuthService.getQrCodeDataUrl(
      otpauthUrl,
    );
    response.setHeader('Content-Type', 'image/png');
    response.send(qrcodeDataUrl);
  }

  @Post('turn-on')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFactorAuth(
    @GetReqUser() reqUser: ReqUser,
    @Body() twoFactorAuthCodeDto: TwoFactorAuthCodeDto,
  ) {
    const { authCode } = twoFactorAuthCodeDto;
    const isCodeValid =
      await this.twoFactorAuthService.isTwoFactorAuthCodeValid(
        authCode,
        reqUser,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    if (authCode) {
      await this.usersService.turnOnNewTwoFactorAuth(reqUser.login42);
    } else {
      await this.usersService.turnOnOldTwoFactorAuth(reqUser.login42);
    }
  }

  @Post('authenticate')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async authenticate(
    @GetReqUser() reqUser: ReqUser,
    @Res() response: Response,
    @Body() twoFactorAuthCodeDto: TwoFactorAuthCodeDto,
  ) {
    const { authCode } = twoFactorAuthCodeDto;
    const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthCodeValid(
      authCode,
      reqUser,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    const jwtToken = this.authService.issueJwtToken(reqUser.login42, true);
    const cookie = this.authService.getAccessTokenCookie(jwtToken);
    response.setHeader('Set-Cookie', cookie);

    response.send(reqUser.login42);
  }
}
