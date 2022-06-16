import { IsOptional, IsString } from 'class-validator';

export class FirstTwoFactorAuthCodeDto {
  @IsOptional()
  @IsString()
  authCode!: string;
}
