import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetReqUser } from 'src/auth/decorators/getReqUser.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { User } from 'src/users/user.entity';
import { CreateMatchDto } from './dto/createMatch.dto';
import { MatchService } from './match.service';

@Controller('match')
@UseGuards(JwtAuthGuard)
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get('/:userLogin42')
  getMatchesForUser(@Param('userLogin42') userLogin42: string) {
    return this.matchService.getForOneUser(userLogin42);
  }

  // dev
  @Post()
  saveMatch(
    @Body() createMatchDto: CreateMatchDto,
    @GetReqUser() reqUser: User,
  ) {
    const { opponentLogin42, selfScore, opponentScore, winnerLogin42 } =
      createMatchDto;
    return this.matchService.create(
      reqUser.login42,
      opponentLogin42,
      selfScore,
      opponentScore,
      winnerLogin42,
    );
  }
}
