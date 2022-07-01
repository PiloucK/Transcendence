import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivateConvModule } from 'src/privateConv/privateConv.module';
import { UsersModule } from 'src/users/users.module';
import { ChannelController } from './channel.controller';
import { Channel } from './channel.entity';
import { ChannelService } from './channel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel]),
    MulterModule.register({ dest: './src/uploads' }),
    UsersModule,
    PrivateConvModule,
    ConfigModule,
  ],
  controllers: [ChannelController],
  providers: [ChannelService],
})
export class ChannelModule {}
