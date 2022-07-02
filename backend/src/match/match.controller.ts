import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { MatchService } from './match.service';

@Controller('match')
@UseGuards(JwtAuthGuard)
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get('/:userLogin42')
  getMatchesForUser(@Param('userLogin42') userLogin42: string) {
    return this.matchService.getForOneUser(userLogin42);
  }
}
