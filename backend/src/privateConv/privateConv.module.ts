import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { PrivateConvController } from './privateConv.controller';
import { PrivateConvRepository } from './privateConv.repository';
import { PrivateConvService } from './privateConv.service';

@Module({
  imports: [TypeOrmModule.forFeature([PrivateConvRepository]), UsersModule],
  controllers: [PrivateConvController],
  providers: [PrivateConvService],
	exports: [PrivateConvService],
})
export class PrivateConvModule {}
