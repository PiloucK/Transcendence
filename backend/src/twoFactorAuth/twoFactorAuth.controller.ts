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
import { GetReqUser } from 'src/auth/getReqUser.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { User } from 'src/users/user.entity';
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
  async generateQrCode(@GetReqUser() reqUser: User, @Res() response: Response) {
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
    @GetReqUser() reqUser: User,
    @Body() { twoFactorAuthCode }: TwoFactorAuthCodeDto,
  ) {
    const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthCodeValid(
      twoFactorAuthCode,
      reqUser,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.usersService.turnOnTwoFactorAuth(reqUser.login42);
  }

  @Post('authenticate')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async authenticate(
    @GetReqUser() reqUser: User,
    @Res() response: Response,
    @Body() { twoFactorAuthCode }: TwoFactorAuthCodeDto,
  ) {
    const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthCodeValid(
      twoFactorAuthCode,
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
