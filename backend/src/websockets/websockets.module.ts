import { forwardRef, Module } from '@nestjs/common';
import { StatusModule } from 'src/status/status.module';
import { WebsocketsGateway } from './websockets.gateway';

@Module({
  imports: [forwardRef(() => StatusModule)],
  providers: [WebsocketsGateway],
  exports: [WebsocketsGateway],
})
export class WebsocketsModule {}
