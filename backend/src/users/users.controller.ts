import { Body, Controller, Get, Post, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserForLeaderboard, UserPublicInfos } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserEloDto, UpdateUserUsernameDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAllUsers(): UserPublicInfos[] {
    return this.usersService.getAllUsers();
  }

  @Get('/leaderboard')
  getUsersForLeaderboard(): UserForLeaderboard[] {
    return this.usersService.getUsersForLeaderboard();
  }

  @Get('/:login')
  getUserById(@Param('login') login42: string): UserPublicInfos {
    return this.usersService.getUserById(login42);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): UserPublicInfos {
    return this.usersService.createUser(createUserDto);
  }

  @Patch('/:login/elo')
  updateUserElo(
    @Param('login') login42: string,
    @Body() updateUserEloDto: UpdateUserEloDto,
  ): UserPublicInfos {
    return this.usersService.updateUserElo(login42, updateUserEloDto);
  }

  @Patch('/:login/username')
  updateUserUsername(
    @Param('login') login42: string,
    @Body() updateUserUsernameDto: UpdateUserUsernameDto,
  ): UserPublicInfos {
    return this.usersService.updateUserUsername(login42, updateUserUsernameDto);
  }
}
