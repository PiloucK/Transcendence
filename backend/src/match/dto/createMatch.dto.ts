import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMatchDto {
  @IsNotEmpty()
  @IsString()
  opponentLogin42!: string;

  @IsNotEmpty()
  @IsNumber()
  selfScore!: number;

  @IsNotEmpty()
  @IsNumber()
  opponentScore!: number;
}
