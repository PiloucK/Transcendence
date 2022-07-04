import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { InvitationController } from './invitation.controller';
import { Invitation } from './invitation.entity';
import { InvitationService } from './invitation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Invitation]), UsersModule],
  controllers: [InvitationController],
  providers: [InvitationService],
})
export class InvitationModule {}
