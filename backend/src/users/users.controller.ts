import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  FriendRequestsSent,
  Friends,
	IMessage,
	DM,
  IUser,
  IUserForLeaderboard,
  IUserPublicInfos,
} from './user.model';
import { GetUsersDto } from './dto/get-users.dto';
import { CreateUserDto } from './dto/create-user.dto';
import {
	SendDMDto,
  UpdateUserEloDto,
  UpdateUserGamesLostDto,
  UpdateUserGamesWonDto,
  UpdateUserUsernameDto,
} from './dto/update-user.dto';
import {
  AcceptFriendRequestDto,
  SendFriendRequestDto,
} from './dto/user-friends.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAllUsers(
    @Query() getUsersDto: GetUsersDto,
  ): IUserPublicInfos[] | IUserForLeaderboard[] {
    if (Object.keys(getUsersDto).length) {
      return this.usersService.getUsersForLeaderboard();
    } else {
      return this.usersService.getAllUsers();
    }
  }

  @Get('/:login42')
  getUserByLogin(@Param('login42') login42: string): IUserPublicInfos {
    return this.usersService.getUserByLogin(login42);
  }

  @Get('/:login42/friends')
  getUserFriends(@Param('login42') login42: string): IUserPublicInfos[] {
    return this.usersService.getUserFriends(login42);
  }

  @Get('/:login42/friendRequestsReceived')
  getUserFriendRequestsReceived(@Param('login42') login42: string): IUserPublicInfos[] {
    return this.usersService.getUserFriendRequestsReceived(login42);
  }

  @Get('/:login42/friendRequestsSent')
  getUserFriendRequestsSent(@Param('login42') login42: string): IUserPublicInfos[] {
    return this.usersService.getUserFriendRequestsSent(login42);
  }

	@Patch('/:login42/createDM')
	createDM(
		@Param('login42') login42: string,
		@Body() sendFriendRequestDto: SendFriendRequestDto,
	): DM {
		return this.usersService.createDM(login42, sendFriendRequestDto);
	}

	@Patch('/:login42/sendDM')
	sendDM(
		@Param('login42') login42: string,
		@Body() sendDMDto: SendDMDto,
	): DM {
		return this.usersService.sendDM(login42, sendDMDto);
	}

	@Get('/:login42/:fLogin42/getOneDM')
	getOneDM(
		@Param('login42') login42: string,
		@Param('fLogin42') fLogin42: string,
	): DM {
		return this.usersService.getOneDM(login42, fLogin42);
	}

	@Get('/:login42/getAllOpenedDM')
	getAllOpenedDM(
		@Param('login42') login42: string,
	): DM[] {
		return this.usersService.getAllOpenedDM(login42);
	}

  @Get('/:login42/blockedUsers')
  blockedUsers(@Param('login42') login42: string): IUserPublicInfos[] {
    return this.usersService.blockedUsers(login42);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): IUser {
    return this.usersService.createUser(createUserDto);
  }

  @Patch('/:login42/blockUser')
  blockUser(
    @Param('login42') login42: string,
    @Body() sendFriendRequestDto: SendFriendRequestDto,
  ): FriendRequestsSent {
    return this.usersService.blockUser(login42, sendFriendRequestDto);
  }

  @Patch('/:login42/unblockUser')
  unblockUser(
    @Param('login42') login42: string,
    @Body() sendFriendRequestDto: SendFriendRequestDto,
  ): FriendRequestsSent {
    return this.usersService.unblockUser(login42, sendFriendRequestDto);
  }

  @Patch('/:login42/sendFriendRequest')
  sendFriendRequest(
    @Param('login42') login42: string,
    @Body() sendFriendRequestDto: SendFriendRequestDto,
  ): FriendRequestsSent {
    return this.usersService.sendFriendRequest(login42, sendFriendRequestDto);
  }

  @Patch('/:login42/cancelFriendRequest')
 	cancelFriendRequest(
    @Param('login42') login42: string,
    @Body() sendFriendRequestDto: SendFriendRequestDto,
  ): FriendRequestsSent {
    return this.usersService.cancelFriendRequest(login42, sendFriendRequestDto);
  }

  @Patch('/:login42/acceptFriendRequest')
  acceptFriendRequest(
    @Param('login42') login42: string,
    @Body() acceptFriendRequestDto: AcceptFriendRequestDto,
  ): Friends {
    return this.usersService.acceptFriendRequest(
      login42,
      acceptFriendRequestDto,
    );
  }

  @Patch('/:login42/declineFriendRequest')
  declineFriendRequest(
    @Param('login42') login42: string,
    @Body() acceptFriendRequestDto: AcceptFriendRequestDto,
  ): Friends {
    return this.usersService.declineFriendRequest(
      login42,
      acceptFriendRequestDto,
    );
  }

  @Patch('/:login42/removeFriend')
  removeFriend(
    @Param('login42') login42: string,
    @Body() acceptFriendRequestDto: AcceptFriendRequestDto,
  ): Friends {
    return this.usersService.removeFriend(
      login42,
      acceptFriendRequestDto,
    );
  }

  @Patch('/:login42/elo')
  updateUserElo(
    @Param('login42') login42: string,
    @Body() updateUserEloDto: UpdateUserEloDto,
  ): IUserPublicInfos {
    return this.usersService.updateUserElo(login42, updateUserEloDto);
  }

  @Patch('/:login42/username')
  updateUserUsername(
    @Param('login42') login42: string,
    @Body() updateUserUsernameDto: UpdateUserUsernameDto,
  ): IUserPublicInfos {
    return this.usersService.updateUserUsername(login42, updateUserUsernameDto);
  }

  @Patch('/:login42/gamesWon')
  updateUserGamesWon(
    @Param('login42') login42: string,
    @Body() updateUserGamesWonDto: UpdateUserGamesWonDto,
  ): IUserPublicInfos {
    return this.usersService.updateUserGamesWon(login42, updateUserGamesWonDto);
  }

  @Patch('/:login42/gamesLost')
  updateUserGamesLost(
    @Param('login42') login42: string,
    @Body() updateUserGamesLostDto: UpdateUserGamesLostDto,
  ): IUserPublicInfos {
    return this.usersService.updateUserGamesLost(
      login42,
      updateUserGamesLostDto,
    );
  }
}
