import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
	constructor(login42: string) {
		this.login42 = login42;
	}
  @IsNotEmpty()
  @IsString()
  login42: string;
}
