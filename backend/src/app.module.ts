import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database-transcendence', // container name in docker-compose.yml
      port: 5432,
      username: 'postgres_user',
      password: 'postgres_pass',
      database: 'pong_db',
      autoLoadEntities: true, // load entities from *.entity.ts files
      synchronize: true, // shouldn't be used in production https://docs.nestjs.com/techniques/database#typeorm-integration
    }),
    AuthModule,
  ],
})
export class AppModule {}
