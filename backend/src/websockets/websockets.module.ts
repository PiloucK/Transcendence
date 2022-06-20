import { forwardRef, Module } from '@nestjs/common';
import { StatusModule } from 'src/status/status.module';
import { GameNamespaces } from './game.gateway';
import { WebsocketsGateway } from './main.gateway';

@Module({
  imports: [forwardRef(() => StatusModule)],
  providers: [WebsocketsGateway, GameNamespaces],
  exports: [WebsocketsGateway],
})
export class WebsocketsModule {}
