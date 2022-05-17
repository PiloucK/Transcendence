import { IsNotEmpty, IsString } from 'class-validator';

export class JwtTokenPayloadDto {
  @IsNotEmpty()
  @IsString()
  login42!: string;
}
