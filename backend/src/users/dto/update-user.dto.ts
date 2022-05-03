import { IsNumber, IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { IMessage } from '../user.model';

export class CreateChannelDto {
	constructor(name: string, password: string, isPrivate: boolean) {
		this.name = name;
		this.password = password;
		this.isPrivate = isPrivate;
	}

	@IsNotEmpty()
	@IsString()
	name!: string;

	@IsNotEmpty()
	@IsString()
	password!: string;

	@IsNotEmpty()
	@IsBoolean()
	isPrivate!: boolean;
}
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
