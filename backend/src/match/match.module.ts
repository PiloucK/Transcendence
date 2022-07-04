import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { MatchController } from './match.controller';
import { Match } from './match.entity';
import { MatchService } from './match.service';

@Module({
  imports: [TypeOrmModule.forFeature([Match]), UsersModule],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
