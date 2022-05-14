import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { FortyTwoStrategy } from './strategies/fortyTwo.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: '3600s' },
          // expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        };
      },
    }), // https://github.com/nestjs/jwt/blob/master/README.md#secret--encryption-key-options
  ],
  providers: [AuthService, FortyTwoStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
