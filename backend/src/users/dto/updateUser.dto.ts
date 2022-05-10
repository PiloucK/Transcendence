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

export class UpdateUserGamesWonDto {
  @IsNotEmpty()
  @IsNumber()
  gamesWon!: number;
}

export class UpdateUserGamesLostDto {
  @IsNotEmpty()
  @IsNumber()
  gamesLost!: number;
}
