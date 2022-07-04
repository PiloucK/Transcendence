import { Module } from '@nestjs/common';
import { MatchModule } from 'src/match/match.module';
import { StatusModule } from 'src/status/status.module';
import { GameNamespace } from './game.gateway';
import { MainGateway } from './main.gateway';

@Module({
  imports: [StatusModule, MatchModule],
  providers: [MainGateway, GameNamespace],
  exports: [MainGateway],
})
export class WebsocketsModule {}
