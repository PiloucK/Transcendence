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
	Channel,
  IUser,
  IUserForLeaderboard,
  IUserPublicInfos,
} from './user.model';
import { GetUsersDto } from './dto/get-users.dto';
import { CreateUserDto } from './dto/create-user.dto';
import {
	CreateChannelDto,
	PasswordChannelDto,
	ChannelIdDto,
	ChannelAdminInteractionsDto,
	ChannelRestrictionDto,
	SendMSGToChannelDto,
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

	@Patch('/:login42/createChannel')
	createChannel(
		@Param('login42') login42: string,
		@Body() createChannel: CreateChannelDto,
	): Channel {
		return this.usersService.createChannel(login42, createChannel);
	}

	@Patch('/:login42/joinProtectedChannel')
	joinProtectedChannel(
		@Param('login42') login42: string,
		@Body() passwordChannelDto: PasswordChannelDto,
	): Channel {
		return this.usersService.joinProtectedChannel(login42, passwordChannelDto);
	}

	@Patch('/:login42/joinChannel')
	joinChannel(
		@Param('login42') login42: string,
		@Body() joinChannelDto: ChannelIdDto,
	): Channel {
		return this.usersService.joinChannel(login42, joinChannelDto);
	}

	@Patch('/:login42/leaveChannel')
	leaveChannel(
		@Param('login42') login42: string,
		@Body() leaveChannelDto: ChannelIdDto,
		): Channel {
		return this.usersService.leaveChannel(login42, leaveChannelDto);
	}

	@Patch(`/:login42/muteAChannelUser`)
	muteAChannelUser(
		@Param('login42') login42: string,
		@Body() channelRestrictionDto: ChannelRestrictionDto,
	): Channel {
		return this.usersService.muteAChannelUser(login42, channelRestrictionDto);
	}

	@Patch(`/:login42/banAChannelUser`)
	banAChannelUser(
		@Param('login42') login42: string,
		@Body() channelRestrictionDto: ChannelRestrictionDto,
	): Channel {
		return this.usersService.banAChannelUser(login42, channelRestrictionDto);
	}

	@Patch('/:login42/setAChannelAdmin')
	setAChannelAdmin(
		@Param('login42') login42: string,
		@Body() channelAdminInteractionsDto: ChannelAdminInteractionsDto,
	): Channel {
		return this.usersService.setAChannelAdmin(login42, channelAdminInteractionsDto);
	}

	@Patch('/:login42/unsetAChannelAdmin')
	unsetAChannelAdmin(
		@Param('login42') login42: string,
		@Body() channelAdminInteractionsDto: ChannelAdminInteractionsDto,
	): Channel {
		return this.usersService.unsetAChannelAdmin(login42, channelAdminInteractionsDto);
	}


	@Patch(`/:login42/sendMSGToChannel`)
	sendMSGToChannel(
		@Param('login42') login42: string,
		@Body() sendMSGToChannel: SendMSGToChannelDto,
	): Channel {
		return this.usersService.sendMSGToChannel(login42, sendMSGToChannel);
	}

	@Get('/:login42/channel/:channelId')
	channel(
		@Param('login42') login42: string,
		@Param('channelId') channelId: string,
	): Channel {
		return this.usersService.channel(login42, channelId);
	}

	@Get('/:login42/publicChannels')
	publicChannels(
		@Param('login42') login42: string,
	): Channel[] {
		return this.usersService.publicChannels(login42);
	}

	@Get('/:login42/joinedChannels')
	joinedChannels(
		@Param('login42') login42: string,
	): Channel[] {
		return this.usersService.joinedChannels(login42);
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
