import { IsOptional, IsString } from 'class-validator';

export class TwoFactorAuthCodeDto {
  @IsOptional()
  @IsString()
  authCode!: string;
}
