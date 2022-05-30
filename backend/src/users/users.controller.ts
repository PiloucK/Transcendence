import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { User } from './user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUsernameDto } from './dto/updateUser.dto';
import { FriendLogin42Dto } from './dto/friendLogin42.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { GetReqUser } from 'src/auth/decorators/getReqUser.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get('/:login42')
  getUserByLogin42(@Param('login42') login42: string): Promise<User> {
    return this.usersService.getUserByLogin42(login42);
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
  deleteUser(
    @Param('login42') login42: string,
    @GetReqUser() reqUser: User,
  ): Promise<void> {
    return this.usersService.deleteUser(reqUser, login42);
  }

  @Patch('/:login42/username')
  updateUsername(
    @Param('login42') login42: string,
    @Body() updateUsernameDto: UpdateUsernameDto,
    @GetReqUser() reqUser: User,
  ): Promise<User> {
    return this.usersService.updateUsername(
      reqUser,
      login42,
      updateUsernameDto,
    );
  }

  @Get('/:login42/friends')
  getUserFriends(
    @Param('login42') login42: string,
    @GetReqUser() reqUser: User,
  ): Promise<User[]> {
    return this.usersService.getUserFriends(reqUser, login42);
  }

  @Get('/:login42/friendRequestsSent')
  getUserFriendRequestsSent(
    @Param('login42') login42: string,
    @GetReqUser() reqUser: User,
  ): Promise<User[]> {
    return this.usersService.getUserFriendRequestsSent(reqUser, login42);
  }

  @Get('/:login42/friendRequestsReceived')
  getUserFriendRequestsReceived(
    @Param('login42') login42: string,
    @GetReqUser() reqUser: User,
  ): Promise<User[]> {
    return this.usersService.getUserFriendRequestsReceived(reqUser, login42);
  }

  @Patch('/:login42/sendFriendRequest')
  sendFriendRequest(
    @Param('login42') login42: string,
    @Body() friendLogin42Dto: FriendLogin42Dto,
    @GetReqUser() reqUser: User,
  ): Promise<User[]> {
    return this.usersService.sendFriendRequest(
      reqUser,
      login42,
      friendLogin42Dto,
    );
  }

  @Patch('/:login42/cancelFriendRequest')
  cancelFriendRequest(
    @Param('login42') login42: string,
    @Body() friendLogin42Dto: FriendLogin42Dto,
    @GetReqUser() reqUser: User,
  ): Promise<User[]> {
    return this.usersService.cancelFriendRequest(
      reqUser,
      login42,
      friendLogin42Dto,
    );
  }

  @Patch('/:login42/acceptFriendRequest')
  acceptFriendRequest(
    @Param('login42') login42: string,
    @Body() friendLogin42Dto: FriendLogin42Dto,
    @GetReqUser() reqUser: User,
  ): Promise<User[]> {
    return this.usersService.acceptFriendRequest(
      reqUser,
      login42,
      friendLogin42Dto,
    );
  }

  @Patch('/:login42/declineFriendRequest')
  declineFriendRequest(
    @Param('login42') login42: string,
    @Body() friendLogin42Dto: FriendLogin42Dto,
    @GetReqUser() reqUser: User,
  ): Promise<User[]> {
    return this.usersService.declineFriendRequest(
      reqUser,
      login42,
      friendLogin42Dto,
    );
  }

  @Patch('/:login42/removeFriend')
  removeFriend(
    @Param('login42') login42: string,
    @Body() friendLogin42Dto: FriendLogin42Dto,
    @GetReqUser() reqUser: User,
  ): Promise<User[]> {
    return this.usersService.removeFriend(reqUser, login42, friendLogin42Dto);
  }

  @Get('/:login42/blockedUsers')
  getUserBlockedUsers(
    @Param('login42') login42: string,
    @GetReqUser() reqUser: User,
  ): Promise<User[]> {
    return this.usersService.getUserBlockedUsers(reqUser, login42);
  }

  @Patch('/:login42/blockUser')
  blockUser(
    @Param('login42') login42: string,
    @Body() friendLogin42Dto: FriendLogin42Dto,
    @GetReqUser() reqUser: User,
  ): Promise<User[]> {
    return this.usersService.blockUser(reqUser, login42, friendLogin42Dto);
  }

  @Patch('/:login42/unblockUser')
  unblockUser(
    @Param('login42') login42: string,
    @Body() friendLogin42Dto: FriendLogin42Dto,
    @GetReqUser() reqUser: User,
  ): Promise<User[]> {
    return this.usersService.unblockUser(reqUser, login42, friendLogin42Dto);
  }
}
