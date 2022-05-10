import { IsOptional, IsString } from 'class-validator';

export class GetUsersDto {
  @IsOptional()
  @IsString()
  forLeaderboard!: boolean; // need to add a question mark for optional value?
}
