import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { PrivateConvModule } from './privateConv/privateConv.module';
import { ChannelModule } from './channel/channel.module';
import { TwoFactorAuthModule } from './twoFactorAuth/twoFactorAuth.module';
import { StatusModule } from './status/status.module';
import { WebsocketsModule } from './websockets/websockets.module';
import { MatchModule } from './match/match.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: true, // load entities from *.entity.ts files
        synchronize: true, // shouldn't be used in production https://docs.nestjs.com/techniques/database#typeorm-integration
        host: configService.get('DATABASE_HOST'), // container name in docker-compose.yml
        port: configService.get('DATABASE_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
      }),
    }),
    UsersModule,
    AuthModule,
    TwoFactorAuthModule,
    PrivateConvModule,
    ChannelModule,
    StatusModule,
    WebsocketsModule,
    MatchModule,
  ],
})
export class AppModule {}
