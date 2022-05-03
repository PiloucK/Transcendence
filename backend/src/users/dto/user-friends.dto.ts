import { IsNotEmpty, IsString } from 'class-validator';

export class SendFriendRequestDto {
  @IsNotEmpty()
  @IsString()
  friendLogin42!: string;
}

export class AcceptFriendRequestDto {
  @IsNotEmpty()
  @IsString()
  friendLogin42!: string;
}