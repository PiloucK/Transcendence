import { IsNumber, IsNotEmpty} from 'class-validator';
export class UpdateUserRankingDto {
	@IsNotEmpty()
	@IsNumber()
	ranking: number;
}