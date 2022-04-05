import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';


@Module({
  imports: [UsersModule, 
  TypeOrmModule.forRoot({
    type: 'postgres', 
    host:'localhost',
    port: 5432, 
    username:'postgres', 
    password:'postgres', 
    database:'trans', 
    autoLoadEntities: true, 
    synchronize: true, 
  })],
  controllers: [UsersController], 
  providers: [UsersService],  


})
export class AppModule {}
