import { forwardRef, Module } from '@nestjs/common';
import { StatusModule } from 'src/status/status.module';
import { GameNamespace } from './game.gateway';
import { WebsocketsGateway } from './main.gateway';

@Module({
  imports: [forwardRef(() => StatusModule)],
  providers: [WebsocketsGateway, GameNamespace],
  exports: [WebsocketsGateway],
})
export class WebsocketsModule {}
