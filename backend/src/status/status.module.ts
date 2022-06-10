import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStatus } from './status.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserStatus]), UsersModule],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}
