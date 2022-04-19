import { Body, Controller, Get, Post, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {User, UserInfos } from './user.entity'

import { UpdateUserRankingDto } from './dto/update-user-ranking.dto';

import {
	validate,
} from 'class-validator';


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

    // Will modify the ranking of a precise user
		@Patch('/:login/ranking')
		updateUserRanking(@Param('login') login: string, @Body() updateUserRankingDto: UpdateUserRankingDto) : UserInfos
		{

			let ranking = new UpdateUserRankingDto();

			ranking.ranking = updateUserRankingDto.ranking;

			validate(ranking).then(errors => {
				// errors is an array of validation errors
				if (errors.length > 0) {
					console.log('validation failed. errors: ', errors);
				} else {
					return this.usersService.updateUserRanking(login, ranking.ranking);
				}
			});

			return new UserInfos();
		}

}
