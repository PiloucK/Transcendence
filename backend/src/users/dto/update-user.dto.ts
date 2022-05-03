import { IsNumber, IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { IMessage, Channel } from '../user.model';

export class CreateChannelDto {
	constructor(channelInfos: Channel) {
		this.channelInfos = channelInfos;
	}

	@IsNotEmpty()
	channelInfos: Channel;
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
