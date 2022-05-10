import { IsNotEmpty, IsString } from 'class-validator';

export class FortyTwoUserProfileDto {
  @IsNotEmpty()
  @IsString()
  username!: string;
}
