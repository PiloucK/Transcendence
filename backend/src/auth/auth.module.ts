import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { FortyTwoStrategy } from './fortyTwo.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule, // not needed?
    JwtModule.registerAsync({
      imports: [ConfigModule], // not needed?
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' },
          // secret: configService.get<string>('JWT_SECRET'),
          // signOptions: {
          //   expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
          // },
        };
      },
    }), // https://github.com/nestjs/jwt/blob/master/README.md#secret--encryption-key-options
  ],
  providers: [AuthService, FortyTwoStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
