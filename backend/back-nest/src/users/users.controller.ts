import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.model'
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController { 
    constructor(private usersService: UsersService) {
    }

    @Get()
    getAllTask(): User []{
        return this.usersService.getAllUsers(); 
    } 

    @Post()
    createUser(@Body() createUserDto: CreateUserDto) : User {
            return this.usersService.createUser(createUserDto); 
        }





    
}
