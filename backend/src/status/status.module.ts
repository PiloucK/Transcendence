import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStatus } from './status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserStatus])],
  controllers: [StatusController],
  providers: [StatusService],
})
export class StatusModule {}
