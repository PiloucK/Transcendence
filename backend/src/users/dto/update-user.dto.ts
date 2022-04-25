import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserEloDto {
  @IsNotEmpty()
  @IsNumber()
  elo!: number;
}

export class UpdateUserUsernameDto {
  @IsNotEmpty()
  @IsString()
  username!: string;
}
