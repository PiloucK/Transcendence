import { forwardRef, Module } from '@nestjs/common';
import { StatusModule } from 'src/status/status.module';
import { GameGateway } from './game.gateway';
import { WebsocketsGateway } from './main.gateway';

@Module({
  imports: [forwardRef(() => StatusModule)],
  providers: [WebsocketsGateway, GameGateway],
  exports: [WebsocketsGateway],
})
export class WebsocketsModule {}
