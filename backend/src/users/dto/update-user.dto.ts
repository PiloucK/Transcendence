import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserRankingDto {
  @IsNotEmpty()
  @IsNumber()
  ranking: number;
}

export class UpdateUserUsernameDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}
