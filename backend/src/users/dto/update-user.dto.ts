import { IsNumber, IsNotEmpty, IsString } from 'class-validator';
import { IMessage } from '../user.model';

export class SendDMDto {
	constructor(login: string, message: IMessage) {
		this.dest = login;
		this.message = message;
	}

	@IsNotEmpty()
	@IsString()
	dest!: string;

	@IsNotEmpty()
	message!: IMessage;
}
export class UpdateUserEloDto {
	constructor(elo: number) {
		this.elo = elo;
	}
  @IsNotEmpty()
  @IsNumber()
  elo!: number;
}

export class UpdateUserUsernameDto {
	constructor(username: string) {
		this.username = username;
	}
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
