import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserEloDto {
	constructor(elo: number) {
		this.elo = elo;
	}
  @IsNotEmpty()
  @IsNumber()
  elo: number;
}

export class UpdateUserUsernameDto {
	constructor(username: string) {
		this.username = username;
	}
  @IsNotEmpty()
  @IsString()
  username: string;
}
