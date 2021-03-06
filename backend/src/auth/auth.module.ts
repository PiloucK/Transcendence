import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { FortyTwoStrategy } from './strategies/fortyTwo.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtSingleFactorStrategy } from './strategies/jwtSingleFactor.strategy';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_ACCESSTOKEN_SECRET'),
          signOptions: {
            expiresIn: `${configService.get(
              'JWT_ACCESSTOKEN_EXPIRATION_TIME',
            )}s`,
          },
        };
      },
    }),
  ],
  providers: [
    AuthService,
    FortyTwoStrategy,
    JwtStrategy,
    JwtSingleFactorStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
