import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { PrivateConvModule } from './privateConv/privateConv.module';
import { ChannelModule } from './channel/channel.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
    }),
    UsersModule,
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
    AuthModule,
    PrivateConvModule,
    ChannelModule,
  ],
})
export class AppModule {}
