import { Module } from '@nestjs/common';
import { WebsocketsGateway } from './websockets.gateway';

@Module({
  providers: [WebsocketsGateway],
})
export class WebsocketsModule {}
