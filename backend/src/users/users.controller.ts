import { Body, Controller, Get, Post, Param, UploadedFile, UseInterceptors, Query, Res, Request,  } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {User, UserInfos } from './user.entity'
import { Observable, of } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'; 
import { v4 as uuid} from 'uuid'; 
import path = require('path'); 
import { join } from 'path'; 

import { fileURLToPath } from 'url'; 



@Controller('users')
export class UsersController { 
    constructor(private usersService: UsersService) {
    }

    @Get()
    getAllUsers() : User[] {
        return this.usersService.getAllUsers();
    }

    @Post('/signup')
    createUser(@Body() createUserDto: CreateUserDto) :      User {
         return this.usersService.createUser(createUserDto); 
        }
    
        @Get('/:login')
        getUserById(@Param('login') login: string ) : UserInfos
        {
            return this.usersService.getUserInfos(login);
        }
    


    
}
