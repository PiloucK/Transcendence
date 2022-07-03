import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateInvitationDto {
  @IsNotEmpty()
  @IsString()
  opponentLogin42!: string;
}
