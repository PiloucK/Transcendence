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
  UseInterceptors,
  UploadedFile,
  StreamableFile,
} from '@nestjs/common';

import { User } from './user.entity';
import { UsersService } from './users.service';
import { UpdateUsernameDto } from './dto/updateUser.dto';
import { FriendLogin42Dto } from './dto/friendLogin42.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { GetReqUser } from 'src/auth/decorators/getReqUser.decorator';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get('/:login42')
  @UseGuards(JwtAuthGuard)
  getUserByLogin42(@Param('login42') login42: string): Promise<User> {
    return this.usersService.getUserByLogin42(login42);
  }

  @Post('/:login42')
  createUser(@Param('login42') login42: string): Promise<User> {
    return this.usersService.createUser(login42, '');
  }

  @Delete() // dev
  @UseGuards(JwtAuthGuard)
  deleteAllUsers(): Promise<void> {
    return this.usersService.deleteAllUsers();
  }

  @Patch('/:login42/username')
  @UseGuards(JwtAuthGuard)
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

  @Post('/:login42/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  updateUserImage(
    @Param('login42') login42: string,
    @GetReqUser() reqUser: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    return this.usersService.updateUserImage(reqUser, login42, file);
  }

  @Get('/image/:imageId')
  @UseGuards(JwtAuthGuard)
  getUserImage(@Param('imageId') imageId: string): StreamableFile {
    const file = createReadStream(
      join(process.cwd(), `/src/uploads/${imageId}`),
    );
    return new StreamableFile(file);
  }

  @Get('/:login42/friends')
  @UseGuards(JwtAuthGuard)
  getUserFriends(
    @Param('login42') login42: string,
    @GetReqUser() reqUser: User,
  ): Promise<User[]> {
    return this.usersService.getUserFriends(reqUser, login42);
  }

  @Get('/:login42/friendRequestsSent')
  @UseGuards(JwtAuthGuard)
  getUserFriendRequestsSent(
    @Param('login42') login42: string,
    @GetReqUser() reqUser: User,
  ): Promise<User[]> {
    return this.usersService.getUserFriendRequestsSent(reqUser, login42);
  }

  @Get('/:login42/friendRequestsReceived')
  @UseGuards(JwtAuthGuard)
  getUserFriendRequestsReceived(
    @Param('login42') login42: string,
    @GetReqUser() reqUser: User,
  ): Promise<User[]> {
    return this.usersService.getUserFriendRequestsReceived(reqUser, login42);
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Patch('/:login42/removeFriend')
  removeFriend(
    @Param('login42') login42: string,
    @Body() friendLogin42Dto: FriendLogin42Dto,
    @GetReqUser() reqUser: User,
  ): Promise<User[]> {
    return this.usersService.removeFriend(reqUser, login42, friendLogin42Dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:login42/blockedUsers')
  getUserBlockedUsers(
    @Param('login42') login42: string,
    @GetReqUser() reqUser: User,
  ): Promise<User[]> {
    return this.usersService.getUserBlockedUsers(reqUser, login42);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:login42/blockUser')
  blockUser(
    @Param('login42') login42: string,
    @Body() friendLogin42Dto: FriendLogin42Dto,
    @GetReqUser() reqUser: User,
  ): Promise<User[]> {
    return this.usersService.blockUser(reqUser, login42, friendLogin42Dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:login42/unblockUser')
  unblockUser(
    @Param('login42') login42: string,
    @Body() friendLogin42Dto: FriendLogin42Dto,
    @GetReqUser() reqUser: User,
  ): Promise<User[]> {
    return this.usersService.unblockUser(reqUser, login42, friendLogin42Dto);
  }
}
