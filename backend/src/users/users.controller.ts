import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Query,
  Delete,
  Req,
  UnauthorizedException,
} from '@nestjs/common';

import { User } from './user.entity';
import { UsersService } from './users.service';
import { GetUsersDto } from './dto/getUsers.dto';
import { CreateUserDto } from './dto/createUser.dto';
import {
  UpdateUserEloDto,
  UpdateUserGamesLostDto,
  UpdateUserGamesWonDto,
  UpdateUserUsernameDto,
} from './dto/updateUser.dto';
import { FriendLogin42Dto } from './dto/friendLogin42.dto';
import { RequestWithUser } from '../interfaces/requestWithUser.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    //if (Object.keys(getUsersDto).length) {
    //return this.usersService.getUsersForLeaderboard();
    //} else {
    return this.usersService.getAllUsers();
    //}
  }

  @Get('/:login42')
  getUserByLogin(@Param('login42') login42: string): Promise<User> {
    return this.usersService.getUserByLogin(login42);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Delete() // dev
  deleteAllUsers(): Promise<void> {
    return this.usersService.deleteAllUsers();
  }

  @Delete('/:login42')
  deleteUser(@Param('login42') login42: string): Promise<void> {
    return this.usersService.deleteUser(login42);
  }

  @Patch('/:login42/username')
  updateUserUsername(
    @Param('login42') login42: string,
    @Body() updateUserUsernameDto: UpdateUserUsernameDto,
    @Req() request: RequestWithUser,
  ): Promise<User> {
    if (request.user.login42 !== login42) {
      throw new UnauthorizedException(
        'You must own the profile of which you want to change the username',
      );
    } else {
      return this.usersService.updateUserUsername(
        login42,
        updateUserUsernameDto,
      );
    }
  }

  @Patch('/:login42/elo')
  updateUserElo(
    @Param('login42') login42: string,
    @Body() updateUserEloDto: UpdateUserEloDto,
  ): Promise<User> {
    return this.usersService.updateUserElo(login42, updateUserEloDto);
  }

  @Patch('/:login42/gamesWon')
  updateUserGamesWon(
    @Param('login42') login42: string,
    @Body() updateUserGamesWonDto: UpdateUserGamesWonDto,
  ): Promise<User> {
    return this.usersService.updateUserGamesWon(login42, updateUserGamesWonDto);
  }

  @Patch('/:login42/gamesLost')
  updateUserGamesLost(
    @Param('login42') login42: string,
    @Body() updateUserGamesLostDto: UpdateUserGamesLostDto,
  ): Promise<User> {
    return this.usersService.updateUserGamesLost(
      login42,
      updateUserGamesLostDto,
    );
  }

  @Get('/:login42/friends')
  getUserFriends(@Param('login42') login42: string): Promise<User[]> {
    return this.usersService.getUserFriends(login42);
  }

  @Get('/:login42/friendRequestsSent')
  getUserFriendRequestsSent(
    @Param('login42') login42: string,
  ): Promise<User[]> {
    return this.usersService.getUserFriendRequestsSent(login42);
  }

  @Get('/:login42/friendRequestsReceived')
  getUserFriendRequestsReceived(
    @Param('login42') login42: string,
  ): Promise<User[]> {
    return this.usersService.getUserFriendRequestsReceived(login42);
  }

  @Patch('/:login42/sendFriendRequest')
  sendFriendRequest(
    @Param('login42') login42: string,
    @Body() friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    return this.usersService.sendFriendRequest(login42, friendLogin42Dto);
  }

  @Patch('/:login42/cancelFriendRequest')
  cancelFriendRequest(
    @Param('login42') login42: string,
    @Body() friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    return this.usersService.cancelFriendRequest(login42, friendLogin42Dto);
  }

  @Patch('/:login42/acceptFriendRequest')
  acceptFriendRequest(
    @Param('login42') login42: string,
    @Body() friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    return this.usersService.acceptFriendRequest(login42, friendLogin42Dto);
  }

  @Patch('/:login42/declineFriendRequest')
  declineFriendRequest(
    @Param('login42') login42: string,
    @Body() friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    return this.usersService.declineFriendRequest(login42, friendLogin42Dto);
  }

  @Patch('/:login42/removeFriend')
  removeFriend(
    @Param('login42') login42: string,
    @Body() friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    return this.usersService.removeFriend(login42, friendLogin42Dto);
  }

  @Get('/:login42/blockedUsers')
  getUserBlockedUsers(@Param('login42') login42: string): Promise<User[]> {
    return this.usersService.getUserBlockedUsers(login42);
  }

  @Patch('/:login42/blockUser')
  blockUser(
    @Param('login42') login42: string,
    @Body() friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    return this.usersService.blockUser(login42, friendLogin42Dto);
  }

  @Patch('/:login42/unblockUser')
  unblockUser(
    @Param('login42') login42: string,
    @Body() friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    return this.usersService.unblockUser(login42, friendLogin42Dto);
  }
}
