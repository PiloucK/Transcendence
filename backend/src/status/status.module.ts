import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}
