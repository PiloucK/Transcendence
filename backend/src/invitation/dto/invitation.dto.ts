import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateInvitationDto {
  @IsNotEmpty()
  @IsString()
  invitedLogin42!: string;
}

export class DeclineInvitationDto {
	@IsNotEmpty()
	@IsString()
	inviterLogin42!: string;
}
