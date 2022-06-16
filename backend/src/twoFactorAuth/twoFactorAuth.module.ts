import { Module } from '@nestjs/common';
import { TwoFactorAuthService } from './twoFactorAuth.service';
import { TwoFactorAuthController } from './twoFactorAuth.controller';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ConfigModule, UsersModule, AuthModule],
  providers: [TwoFactorAuthService],
  controllers: [TwoFactorAuthController],
})
export class TwoFactorAuthModule {}
