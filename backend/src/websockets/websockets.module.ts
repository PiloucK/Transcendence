import { Module } from '@nestjs/common';
import { StatusModule } from 'src/status/status.module';
import { GameNamespace } from './game.gateway';
import { MainGateway } from './main.gateway';

@Module({
  imports: [StatusModule],
  providers: [MainGateway, GameNamespace],
  exports: [MainGateway],
})
export class WebsocketsModule {}
