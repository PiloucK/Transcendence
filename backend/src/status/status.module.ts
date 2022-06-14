import { forwardRef, Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStatus } from './status.entity';
import { UsersModule } from 'src/users/users.module';
import { WebsocketsModule } from 'src/websockets/websockets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserStatus]),
    UsersModule,
    forwardRef(() => WebsocketsModule),
  ],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}
