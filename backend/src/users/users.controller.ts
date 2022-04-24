import { Body, Controller, Get, Post, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUser, IUserForLeaderboard, IUserPublicInfos } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserEloDto, UpdateUserUsernameDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAllUsers(): IUserPublicInfos[] {
    return this.usersService.getAllUsers();
  }

  @Get('/leaderboard')
  getUsersForLeaderboard(): IUserForLeaderboard[] {
    return this.usersService.getUsersForLeaderboard();
  }

  @Get('/:login42')
  getUserById(@Param('login42') login42: string): IUserPublicInfos | undefined {
    return this.usersService.getUserById(login42);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): IUser {
    return this.usersService.createUser(createUserDto);
  }

  @Patch('/:login42/elo')
  updateUserElo(
    @Param('login42') login42: string,
    @Body() updateUserEloDto: UpdateUserEloDto,
  ): IUserPublicInfos | undefined {
    return this.usersService.updateUserElo(login42, updateUserEloDto);
  }

  @Patch('/:login42/username')
  updateUserUsername(
    @Param('login42') login42: string,
    @Body() updateUserUsernameDto: UpdateUserUsernameDto,
  ): IUserPublicInfos | undefined {
    return this.usersService.updateUserUsername(login42, updateUserUsernameDto);
  }
}
