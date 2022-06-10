import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { GetReqUser } from 'src/auth/decorators/getReqUser.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { JwtSingleFactorAuthGuard } from 'src/auth/guards/jwtSingleFactorAuth.guard';
import { ReqUser } from 'src/reqUser.interface';
import { UsersService } from 'src/users/users.service';
import { FirstTwoFactorAuthCodeDto } from './dto/firstTwoFactorAuthCode.dto';
import { TwoFactorAuthCodeDto } from './dto/twoFactorAuthCode.dto';
import { TwoFactorAuthService } from './twoFactorAuth.service';

@Controller('two-factor-auth')
export class TwoFactorAuthController {
  constructor(
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('generate-qrcode')
  @UseGuards(JwtAuthGuard)
  async generateQrCode(
    @GetReqUser() reqUser: ReqUser,
    @Res() response: Response,
  ) {
    const otpauthUrl = await this.twoFactorAuthService.generateSecret(reqUser);

    const qrcodeDataUrl = await this.twoFactorAuthService.getQrCodeDataUrl(
      otpauthUrl,
    );
    response.setHeader('Content-Type', 'image/png');
    response.send(qrcodeDataUrl);
  }

  @Post('turn-on')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async turnOn(
    @GetReqUser() reqUser: ReqUser,
    @Res() response: Response,
    @Body() firstTwoFactorAuthCodeDto: FirstTwoFactorAuthCodeDto,
  ) {
    const { authCode } = firstTwoFactorAuthCodeDto;
    const isCodeValid = await this.twoFactorAuthService.isFirstCodeValid(
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

    const jwtToken = this.authService.issueJwtToken(reqUser.login42, true);
    const cookie = this.authService.getAccessTokenCookie(jwtToken);
    response.setHeader('Set-Cookie', cookie);

    response.send(reqUser.login42);
  }

  @Post('authenticate')
  @HttpCode(200)
  @UseGuards(JwtSingleFactorAuthGuard)
  async authenticate(
    @GetReqUser() reqUser: ReqUser,
    @Res() response: Response,
    @Body() twoFactorAuthCodeDto: TwoFactorAuthCodeDto,
  ) {
    const { authCode } = twoFactorAuthCodeDto;
    const isCodeValid = await this.twoFactorAuthService.isCodeValid(
      authCode,
      reqUser,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    const jwtToken = this.authService.issueJwtToken(reqUser.login42, true);
    const cookie = this.authService.getAccessTokenCookie(jwtToken);
    response.setHeader('Set-Cookie', cookie);

    // response.redirect(
    //   `http://${this.configService.get('HOST')}:${this.configService.get(
    //     'FRONTEND_PORT',
    //   )}`,
    // );
  }

  @Post('turn-off')
  @HttpCode(200)
  @UseGuards(JwtSingleFactorAuthGuard)
  async turnOff(@GetReqUser() reqUser: ReqUser) {
    this.usersService.turnOffTwoFactorAuth(reqUser.login42);
  }

  //dev
  @Get('enabled')
  @UseGuards(JwtAuthGuard)
  async is2FAenabled(@GetReqUser() reqUser: ReqUser) {
    const user = await this.usersService.getUserByLogin42(reqUser.login42);

    return user.isTwoFactorAuthEnabled;
  }
}
