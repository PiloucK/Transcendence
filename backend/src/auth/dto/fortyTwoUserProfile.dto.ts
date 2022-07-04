import { IsNotEmpty, IsString } from 'class-validator';

export class FortyTwoUserProfileDto {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  photos!: Array<{ value: string }>;
}
