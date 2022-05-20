import { IsNotEmpty, IsString } from 'class-validator';

// I don't know where to define thoses types.
export type Message = { author: string; content: string };
export type Invitation = { author: string; channelId: string };

export class SendPrivateMessageDto {
  @IsNotEmpty()
  @IsString()
  sender!: string;

  @IsNotEmpty()
  @IsString()
  receiver!: string;

  @IsNotEmpty()
  message!: Message;
}

export class GetPrivateConvDto {
  constructor(login42: string, fLogin42: string) {
    this.login42 = login42;
    this.fLogin42 = fLogin42;
  }

  @IsNotEmpty()
  @IsString()
  login42!: string;

  @IsNotEmpty()
  @IsString()
  fLogin42!: string;
}

export class GetPrivateConvsDto {
  constructor(login42: string) {
    this.login42 = login42;
  }

  @IsNotEmpty()
  @IsString()
  login42!: string;
}
