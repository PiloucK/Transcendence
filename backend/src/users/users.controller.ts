import { Body, Controller, Get, Post, Param, Patch } from '@nestjs/common';
import { validate } from 'class-validator';
import { UsersService } from './users.service';
import { User, UserInfos } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import {
  UpdateUserRankingDto,
  UpdateUserUsernameDto,
} from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAllUsers(): UserInfos[] {
    return this.usersService.getAllUsers();
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): User {
    return this.usersService.createUser(createUserDto);
  }

  @Get('/:login')
  getUserById(@Param('login') login: string): UserInfos {
    return this.usersService.getUserInfos(login);
  }

  // Will modify the ranking of a precise user
  @Patch('/:login/ranking')
  updateUserRanking(
    @Param('login') login: string,
    @Body() updateUserRankingDto: UpdateUserRankingDto,
  ): UserInfos {
    const ranking = new UpdateUserRankingDto();

    ranking.ranking = updateUserRankingDto.ranking;

    validate(ranking).then((errors) => {
      // errors is an array of validation errors
      if (errors.length > 0) {
        console.log('validation failed. errors: ', errors);
      } else {
        return this.usersService.updateUserRanking(login, ranking.ranking);
      }
    });

    return new UserInfos();
  }

  @Patch('/:login/username')
  updateUserUsername(
    @Param('login') login: string,
    @Body() updateUserUsernameDto: UpdateUserUsernameDto,
  ): UserInfos {
    console.log(login, updateUserUsernameDto);
    const username = new UpdateUserUsernameDto();

    username.username = updateUserUsernameDto.username;

    validate(username).then((errors) => {
      if (errors.length > 0) {
        console.log('validation failed. errors: ', errors);
      } else {
        return this.usersService.updateUserUsername(login, username.username);
      }
    });

    return new UserInfos();
  }
}
