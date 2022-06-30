import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivateConvModule } from 'src/privateConv/privateConv.module';
import { UsersModule } from 'src/users/users.module';
import { UsersRepository } from 'src/users/users.repository';
import { ChannelController } from './channel.controller';
import { ChannelRepository } from './channel.repository';
import { ChannelService } from './channel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelRepository, UsersRepository]),
    MulterModule.register({ dest: './src/uploads' }),
    UsersModule,
    PrivateConvModule,
    ConfigModule,
  ],
  controllers: [ChannelController],
  providers: [ChannelService],
})
export class ChannelModule {}
