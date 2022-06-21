import { forwardRef, Module } from '@nestjs/common';
import { StatusModule } from 'src/status/status.module';
import { GameNamespace } from './game.gateway';
import { MainGateway } from './main.gateway';

@Module({
  imports: [forwardRef(() => StatusModule)],
  providers: [MainGateway, GameNamespace],
  exports: [MainGateway],
})
export class WebsocketsModule {}
