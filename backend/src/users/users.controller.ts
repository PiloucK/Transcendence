import { Body, Controller, Get, Post, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserInfos } from './user.entity';
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

  @Get('/:login')
  getUserById(@Param('login') login: string): UserInfos {
    return this.usersService.getUserInfos(login);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): UserInfos {
    return this.usersService.createUser(createUserDto);
  }

  // Will modify the ranking of a precise user
  @Patch('/:login/ranking')
  updateUserRanking(
    @Param('login') login: string,
    @Body() updateUserRankingDto: UpdateUserRankingDto,
  ): UserInfos {
    const { ranking } = updateUserRankingDto;
    return this.usersService.updateUserRanking(login, ranking);
  }

  @Patch('/:login/username')
  updateUserUsername(
    @Param('login') login: string,
    @Body() updateUserUsernameDto: UpdateUserUsernameDto,
  ): UserInfos {
    const { username } = updateUserUsernameDto;
    return this.usersService.updateUserUsername(login, username);
  }
}
