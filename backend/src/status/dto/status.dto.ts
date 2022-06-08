import { IsNotEmpty, IsString } from 'class-validator';

export class StatusDto {
  @IsNotEmpty()
  @IsString()
  socketId!: string;

  @IsNotEmpty()
  @IsString()
  userLogin42!: string;
}
