import { IsOptional, IsString } from 'class-validator';

export class FirstTwoFactorAuthCodeDto {
  @IsOptional()
  @IsString()
  firstAuthCode!: string;
}
