import { IsNotEmpty, IsString } from 'class-validator';

export class FriendLogin42Dto {
  @IsNotEmpty()
  @IsString()
  friendLogin42!: string;
}
