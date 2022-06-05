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
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { GetReqUser } from 'src/auth/decorators/getReqUser.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { ReqUser } from 'src/reqUser.interface';
import { User } from 'src/users/user.entity';
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
    @Body() firstTwoFactorAuthCodeDto: FirstTwoFactorAuthCodeDto,
  ) {
    const { firstAuthCode } = firstTwoFactorAuthCodeDto;
    const isCodeValid =
      await this.twoFactorAuthService.isFirstTwoFactorAuthCodeValid(
        firstAuthCode,
        reqUser,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    if (firstAuthCode) {
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

  //dev
  @Get('enabled')
  @UseGuards(JwtAuthGuard)
  async is2FAenabled(@GetReqUser() reqUser: ReqUser) {
    const user = await this.usersService.getUserByLogin42(reqUser.login42);

    return user.isTwoFactorAuthEnabled;
  }
}
