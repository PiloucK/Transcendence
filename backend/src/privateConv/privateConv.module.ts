import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { PrivateConvController } from './privateConv.controller';
import { PrivateConv } from './privateConv.entity';
import { PrivateConvService } from './privateConv.service';

@Module({
  imports: [TypeOrmModule.forFeature([PrivateConv]), UsersModule],
  controllers: [PrivateConvController],
  providers: [PrivateConvService],
  exports: [PrivateConvService],
})
export class PrivateConvModule {}
