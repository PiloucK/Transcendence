import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { ChannelController } from './channel.controller';
import { ChannelRepository } from './channel.repository';
import { ChannelService } from './channel.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelRepository]), UsersModule],
  controllers: [ChannelController],
  providers: [ChannelService],
})
export class ChannelModule {}
