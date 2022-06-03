import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  login42!: string;

  @IsNotEmpty()
  @IsString()
  photo42!: string;
}
