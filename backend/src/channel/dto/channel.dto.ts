import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

// I don't know where to define this type.
export type Message = { author: string; content: string };
// login; end of the restriction in ms.
export type restriction = { login: string; until: number };

export class ChannelInfoDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsString()
  password!: string;

  @IsNotEmpty()
  @IsBoolean()
  isPrivate!: boolean;
}

export class JoinProtectedChannelDto {
  @IsNotEmpty()
  @IsString()
  channelId!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}

export class ChannelIdDto {
  @IsNotEmpty()
  @IsString()
  channelId!: string;
}

export class InteractionDto {
  @IsNotEmpty()
  @IsString()
  channelId!: string;

  @IsNotEmpty()
  @IsString()
  userLogin42!: string;
}

export class RestrictionDto {
  @IsNotEmpty()
  @IsString()
  channelId!: string;

  @IsNotEmpty()
  @IsString()
  userLogin42!: string;

  @IsNotEmpty()
  @IsNumber()
  duration!: number;
}

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  channelId!: string;

  @IsNotEmpty()
  message!: Message;
}
