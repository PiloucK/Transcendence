import { IsNotEmpty, IsString } from 'class-validator';

// I don't know where to define thoses types.
export type Message = { author: string; content: string };
export type Invitation = { author: string; channelId: string };

export class SendPrivateMessageDto {
  constructor(
    senderLogin42: string,
    receiverLogin42: string,
    message: Message,
  ) {
    this.sender = senderLogin42;
    this.receiver = receiverLogin42;
    this.message = message;
  }

  @IsNotEmpty()
  @IsString()
  sender!: string;

  @IsNotEmpty()
  @IsString()
  receiver!: string;

  @IsNotEmpty()
  message!: Message;
}
