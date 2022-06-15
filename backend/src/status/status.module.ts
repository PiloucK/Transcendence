import { forwardRef, Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { UsersModule } from 'src/users/users.module';
import { WebsocketsModule } from 'src/websockets/websockets.module';

@Module({
  imports: [UsersModule, forwardRef(() => WebsocketsModule)],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}
