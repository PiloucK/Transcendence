import { IsNumber, IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { IMessage, Channel } from '../user.model';

export class CreateChannelDto {
	constructor(channelInfos: Channel) {
		this.channelInfos = channelInfos;
	}

	@IsNotEmpty()
	channelInfos: Channel;
}

export class PasswordChannelDto {
	constructor(channelId: string, password: string) {
		this.channelId = channelId;
		this.password = password;
	}

	@IsNotEmpty()
	@IsString()
	channelId: string;
	
	@IsNotEmpty()
	@IsString()
	password: string;
}	

export class ChannelIdDto {
	constructor(channelId: string) {
		this.channelId = channelId;
	}

	@IsNotEmpty()
	@IsString()
	channelId: string;
}

export class ChannelAdminInteractionsDto {
	constructor(channelId: string, userLogin42: string) {
		this.channelId = channelId;
		this.userLogin42 = userLogin42;
	}

	@IsNotEmpty()
	@IsString()
	channelId: string;

	@IsNotEmpty()
	@IsString()
	userLogin42: string;
}

export class ChannelRestrictionDto {
	constructor(channelId: string, userLogin42: string, duration: number) {
		this.channelId = channelId;
		this.userLogin42 = userLogin42;
		this.duration = duration;
	}

	@IsNotEmpty()
	@IsString()
	channelId: string;

	@IsNotEmpty()
	@IsString()
	userLogin42: string;

	@IsNotEmpty()
	@IsNumber()
	duration: number;
}

export class SendMSGToChannelDto {
	constructor(channelId: string, message: IMessage) {
		this.channelId = channelId;
		this.message = message;
	}

	@IsNotEmpty()
	@IsString()
	channelId: string;

	@IsNotEmpty()
	message: IMessage;
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
