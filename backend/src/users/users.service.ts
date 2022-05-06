import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import {
	FriendRequestsReceived,
  FriendRequestsSent,
  Friends,
	IMessage,
	DM,
	Channel,
  IUser,
  IUserForLeaderboard,
  IUserPublicInfos,
} from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import {
	CreateChannelDto,
	PasswordChannelDto,
	ChannelIdDto,
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

@Injectable()
export class UsersService {
  // to split when using the db: UsersService and UsersFriendsService
  private users: IUser[] = [];
	private directConversations: DM[] = [];
	private channels: Channel[] = [];

  private createUserPublicInfos(user: IUser): IUserPublicInfos {
    const ret: IUserPublicInfos = {
      login42: user.login42,
      username: user.username,
      elo: user.elo,
      gamesWon: user.gamesWon,
      gamesLost: user.gamesLost,
    };
    return ret;
  }
	private createUserMinimalInfos(user: IUser): IUserForLeaderboard {
		const ret: IUserForLeaderboard = {
			login42: user.login42,
			username: user.username,
			elo: user.elo,
		};
		return ret;
	}
	
  getAllUsers(): IUserPublicInfos[] {
    return this.users.map((user) => this.createUserPublicInfos(user));
  }

  getUsersForLeaderboard(): IUserForLeaderboard[] {
    return this.users
      .map((user) => {
        const ret: IUserForLeaderboard = {
          login42: user.login42,
          username: user.username,
          elo: user.elo,
        };
        return ret;
      })
      .sort((a, b) => a.elo - b.elo);
  }

  private searchUser(login42: string): IUser | undefined {
    return this.users.find((user) => user.login42 == login42);
  }

  getUserByLogin(login42: string): IUserPublicInfos {
    const user: IUser | undefined = this.searchUser(login42);
    if (!user) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }
    return this.createUserPublicInfos(user);
  }

  getUserFriends(login42: string): IUserPublicInfos[] {
    const user: IUser | undefined = this.searchUser(login42);
    if (!user) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }
    return user.friends.map((curLogin42) => {
      const friend = this.searchUser(curLogin42);
      if (!friend) {
        throw new NotFoundException(
          `User (friend) with login42 "${curLogin42}" not found`,
        );
      }
      return this.createUserPublicInfos(friend);
    });
  }

  getUserFriendRequestsReceived(login42: string): IUserPublicInfos[] {
    const user: IUser | undefined = this.searchUser(login42);
    if (!user) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }
    return user.friendRequestsReceived.map((curLogin42) => {
      const friend = this.searchUser(curLogin42);
      if (!friend) {
        throw new NotFoundException(
          `User (friend) with login42 "${curLogin42}" not found`,
        );
      }
      return this.createUserPublicInfos(friend);
    });
  }

  getUserFriendRequestsSent(login42: string): IUserPublicInfos[] {
    const user: IUser | undefined = this.searchUser(login42);
    if (!user) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }
    return user.friendRequestsSent.map((curLogin42) => {
      const friend = this.searchUser(curLogin42);
      if (!friend) {
        throw new NotFoundException(
          `User (friend) with login42 "${curLogin42}" not found`,
        );
      }
      return this.createUserPublicInfos(friend);
    });
  }

	private areFriends(user: IUser, friend: IUser): boolean {
		return user.friends.includes(friend.login42);
	}

	private getUsersDM(user: IUser, friend: IUser) : DM | undefined {
		const dm: DM | undefined = this.directConversations.find(
			(curDM) =>
				(curDM.userOne.login42 === user.login42 && curDM.userTwo.login42 === friend.login42) ||
				(curDM.userOne.login42 === friend.login42 && curDM.userTwo.login42 === user.login42)
			);
		return dm;
	}

	createChannel(login42: string, createChannelDto: CreateChannelDto): Channel {
		const user: IUser | undefined = this.searchUser(login42);
		if (!user) {
			throw new NotFoundException(`User with login42 "${login42}" not found`);
		}

		const channel: Channel = {
			name: createChannelDto.channelInfos.name,
			id: uuid(),
			password: createChannelDto.channelInfos.password,
			isPrivate: createChannelDto.channelInfos.isPrivate,
			owner: login42,
			admin: [login42,],
			muted: [],
			banned: [],
			users: [this.createUserMinimalInfos(user),],
			messages: [],
		};

		this.channels.push(channel);

		return channel;
	}

	joinProtectedChannel(login42: string, passwordChannelDto: PasswordChannelDto): Channel {
		const user: IUser | undefined = this.searchUser(login42);
		if (!user) {
			throw new NotFoundException(`User with login42 "${login42}" not found`);
		}

		const channel: Channel | undefined = this.channels.find(
			(curChannel) => curChannel.id === passwordChannelDto.channelId
		);
		if (!channel) {
			throw new NotFoundException(`Channel with id "${passwordChannelDto.channelId}" not found`);
		}

		if (channel.banned.includes(login42)) {
			throw new ForbiddenException(`You are banned from this channel`);
		}

		if (channel.users.find((curUser) => curUser.login42 === login42)) {
			return channel;
		}

		if (passwordChannelDto.password === channel.password) {
		channel.users.push(this.createUserMinimalInfos(user));
		} else {
			throw new ForbiddenException(`Wrong password`);
		}
		
		return channel;
	}
	
	joinChannel(login42: string, joinChannelDto: ChannelIdDto): Channel {
		const user: IUser | undefined = this.searchUser(login42);
		if (!user) {
			throw new NotFoundException(`User with login42 "${login42}" not found`);
		}

		const channel: Channel | undefined = this.channels.find(
			(curChannel) => curChannel.id === joinChannelDto.channelId
		);
		if (!channel) {
			throw new NotFoundException(`Channel with id "${joinChannelDto.channelId}" not found`);
		}

		if (channel.banned.includes(login42)) {
			throw new ForbiddenException(`You are banned from this channel`);
		}

		if (channel.users.find((curUser) => curUser.login42 === login42)) {
			return channel;
		}

		channel.users.push(this.createUserMinimalInfos(user));

		return channel;
	}

	deleteChannel(channelIdDto: ChannelIdDto): Channel {
		const channel: Channel | undefined = this.channels.find(	
			(curChannel) => curChannel.id === channelIdDto.channelId
		);
		if (!channel) {
			throw new NotFoundException(`Channel with id "${channelIdDto.channelId}" not found`);
		}

		const index: number = this.channels.indexOf(channel);
		if (index === -1) {
			throw new NotFoundException(`Channel with id "${channelIdDto.channelId}" not found`);
		}

		this.channels.splice(index, 1);
		
		return channel;
	}

	leaveChannel(login42: string, leaveChannelDto: ChannelIdDto): Channel {
		const user: IUser | undefined = this.searchUser(login42);
		if (!user) {
			throw new NotFoundException(`User with login42 "${login42}" not found`);
		}

		const channel: Channel | undefined = this.channels.find(
			(curChannel) => curChannel.id === leaveChannelDto.channelId
		);
		if (!channel) {
			throw new NotFoundException(`Channel with id "${leaveChannelDto.channelId}" not found`);
		}

		
		if (!channel.users.find((curUser) => curUser.login42 === login42)) {
			throw new ForbiddenException(`You are not in this channel`);
		}

		channel.users = channel.users.filter((curUser) => curUser.login42 !== login42);
		channel.admin = channel.admin.filter((curUser) => curUser !== login42);
		channel.muted = channel.muted.filter((curUser) => curUser !== login42);

		if (channel.owner === login42) {
			if (channel.users.length > 0) {
				channel.owner = channel.users[0].login42;
				if (!channel.admin.includes(channel.owner)) {
					channel.admin.push(channel.owner);
				}
			} else {
				return this.deleteChannel(leaveChannelDto);
			}
		}

		return channel;
	}

	sendMSGToChannel(login42: string, sendMSGToChannelDto: SendMSGToChannelDto): Channel {
		const user: IUser | undefined = this.searchUser(login42);
		if (!user) {
			throw new NotFoundException(`User with login42 "${login42}" not found`);
		}

		const channel: Channel | undefined = this.channels.find(
			(curChannel) => curChannel.id === sendMSGToChannelDto.channelId
		);
		if (!channel) {
			throw new NotFoundException(`Channel with id "${sendMSGToChannelDto.channelId}" not found`);
		}

		if (channel.banned.includes(login42)) {
			throw new ForbiddenException(`You are banned from this channel`);
		}

		if (!channel.users.find((curUser) => curUser.login42 === login42)) {
			throw new ForbiddenException(`You are not in this channel`);
		}

		channel.messages.push(sendMSGToChannelDto.message);

		return channel;
	}

	channel(login42: string, channelId: string): Channel {
		const user: IUser | undefined = this.searchUser(login42);
		if (!user) {
			throw new NotFoundException(`User with login42 "${login42}" not found`);
		}

		const channel: Channel | undefined = this.channels.find(
			(curChannel) => curChannel.id === channelId
		);
		if (!channel) {
			throw new NotFoundException(`Channel with id "${channelId}" not found`);
		}

		if (channel.banned.includes(login42)) {
			throw new ForbiddenException(`You are banned from this channel`);
		}

		if (!channel.users.find((curUser) => curUser.login42 === login42)) {
			throw new ForbiddenException(`You are not in this channel`);
		}

		// Remove messages of the blocked users
		const cleanedMessages: IMessage[] = channel.messages.filter((curMessage) => {
			return !user.blockedUsers.includes(curMessage.author);
		}
		);
		
		return {
			...channel,
			messages: cleanedMessages,
		}
	}

	publicChannels(login42: string): Channel[] {
		const user: IUser | undefined = this.searchUser(login42);
		if (!user) {
			throw new NotFoundException(`User with login42 "${login42}" not found`);
		}
		const publicChannels: Channel[] = this.channels.filter(
			(curChannel) => !curChannel.isPrivate && curChannel.banned.indexOf(login42) === -1
		);
		return publicChannels;
	}
	
	joinedChannels(login42: string): Channel[] {
		const user: IUser | undefined = this.searchUser(login42);
		if (!user) {
			throw new NotFoundException(`User with login42 "${login42}" not found`);
		}
		const joinedChannels: Channel[] = this.channels.filter(
			(curChannel) => curChannel.users.find((curUser) => curUser.login42 === login42)
		);
		return joinedChannels;
	}

  createDM(
    login42: string,
    sendFriendRequestDto: SendFriendRequestDto,
  ): DM {
    const { friendLogin42 } = sendFriendRequestDto;

    const user: IUser | undefined = this.searchUser(login42);
    if (!user) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }

    const friend: IUser | undefined = this.searchUser(friendLogin42);
    if (!friend) {
      throw new NotFoundException(
        `User (friend) with login42 "${friendLogin42}" not found`,
      );
    }

		// If a DM is found with the two users, return it
		const dm: DM | undefined = this.getUsersDM(user, friend);
		if (dm) {
			return dm;
		}

		if (this.areFriends(user, friend)) {
			this.directConversations.push({
				userOne: user,
				userTwo: friend,
				messages: [],
			});
		} else {
			throw new NotFoundException(
				`User (friend) with login42 "${friendLogin42}" is not your friend`,
			);
		}

		return this.directConversations[this.directConversations.length - 1];
  }

  sendDM(
    login42: string,
    sendDMDto: SendDMDto,
  ): DM {
    const { dest, message } = sendDMDto;

    const user: IUser | undefined = this.searchUser(login42);
    if (!user) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }

    const friend: IUser | undefined = this.searchUser(dest);
    if (!friend) {
      throw new NotFoundException(
        `User (friend) with login42 "${dest}" not found`,
      );
    }

		const dm: DM | undefined = this.getUsersDM(user, friend);
		if (dm) {
			dm.messages.push(message);
		} else {
			throw new NotFoundException(
				`You don't have a direct conversation with user with login42 "${dest}"`,
			);
		}
		return dm;
  }

  getOneDM(
    login42: string,
    fLogin42: string,
  ): DM {
    const user: IUser | undefined = this.searchUser(login42);
    if (!user) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }

    const friend: IUser | undefined = this.searchUser(fLogin42);
    if (!friend) {
      throw new NotFoundException(
        `User (friend) with login42 "${fLogin42}" not found`,
      );
    }

		// If a DM is found with the two users, return it
		const dm: DM | undefined = this.getUsersDM(user, friend);
		if (dm) {
			return dm;
		} else {
			throw new NotFoundException(
				`Your are not in a direct conversation with user with login42 "${fLogin42}"`,
			);
		}
  }

	getAllOpenedDM(
    login42: string,
  ): DM[] {
    const user: IUser | undefined = this.searchUser(login42);
    if (!user) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }

		return this.directConversations.filter((dm) => {
			return (
				dm.userOne.login42 === user.login42 || dm.userTwo.login42 === user.login42
			);
		});
  }

  createUser(createUserDto: CreateUserDto): IUser {
    const { login42 } = createUserDto;
    let user: IUser | undefined = this.searchUser(login42);
    if (!user) {
      user = {
        id: uuid(),
        login42,
        token42: '',
        username: login42,
        friends: [],
        friendRequestsSent: [],
        friendRequestsReceived: [],
        blockedUsers: [],
        elo: 0,
        gamesWon: 0,
        gamesLost: 0,
        twoFa: false,
      };
      this.users.push(user);
    }
    return user;
  }

	blockedUsers(login42: string): IUserPublicInfos[] {
		const user: IUser | undefined = this.searchUser(login42);
		if (!user) {
			throw new NotFoundException(`User with login42 "${login42}" not found`);
		}
		return user.blockedUsers.map((curLogin42) => {
			const user = this.searchUser(curLogin42);
			if (!user) {
				throw new NotFoundException(
					`User with login42 "${curLogin42}" not found`,
				);
			}
			return this.createUserPublicInfos(user);
		});
	}

  blockUser(
    login42: string,
    sendFriendRequestDto: SendFriendRequestDto,
  ): FriendRequestsSent {
    const { friendLogin42 } = sendFriendRequestDto;

    const user: IUser | undefined = this.searchUser(login42);
    if (!user) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }

    const friend: IUser | undefined = this.searchUser(friendLogin42);
    if (!friend) {
      throw new NotFoundException(
        `User (friend) with login42 "${friendLogin42}" not found`,
      );
    }

		if (user.blockedUsers.includes(friendLogin42)) {
			throw new NotFoundException(
				`User with login42 "${login42}" already blocked`,
			);
		} else {
			user.blockedUsers.push(friendLogin42);
		}

    return user.blockedUsers;
  }

  unblockUser(
    login42: string,
    sendFriendRequestDto: SendFriendRequestDto,
  ): FriendRequestsSent {
    const { friendLogin42 } = sendFriendRequestDto;

    const user: IUser | undefined = this.searchUser(login42);
    if (!user) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }

    const friend: IUser | undefined = this.searchUser(friendLogin42);
    if (!friend) {
      throw new NotFoundException(
        `User (friend) with login42 "${friendLogin42}" not found`,
      );
    }

		if (user.blockedUsers.includes(friendLogin42)) {
			user.blockedUsers.splice(user.blockedUsers.indexOf(friendLogin42), 1);
		} else {
			throw new NotFoundException(
				`User with login42 "${login42}" not blocked`,
			);
		}

    return user.blockedUsers;
  }

  sendFriendRequest(
    login42: string,
    sendFriendRequestDto: SendFriendRequestDto,
  ): FriendRequestsSent {
    const { friendLogin42 } = sendFriendRequestDto;

    const user: IUser | undefined = this.searchUser(login42);
    if (!user) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }

    const friend: IUser | undefined = this.searchUser(friendLogin42);
    if (!friend) {
      throw new NotFoundException(
        `User (friend) with login42 "${friendLogin42}" not found`,
      );
    }

		if (user.friendRequestsReceived.includes(friendLogin42)) {
			user.friends.push(friendLogin42);
			friend.friends.push(login42);
			user.friendRequestsReceived = user.friendRequestsReceived.filter(
				(curLogin42) => curLogin42 !== friendLogin42,
			);
			friend.friendRequestsSent = friend.friendRequestsSent.filter(
				(curLogin42) => curLogin42 !== login42,
			);
		} else {
			user.friendRequestsSent.push(friendLogin42);
			friend.friendRequestsReceived.push(login42);
		}

    return user.friendRequestsSent;
  }

	cancelFriendRequest(
    login42: string,
    sendFriendRequestDto: SendFriendRequestDto,
  ): FriendRequestsReceived {
    const { friendLogin42 } = sendFriendRequestDto;

    const user: IUser | undefined = this.searchUser(login42);
    if (!user) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }

    const friend: IUser | undefined = this.searchUser(friendLogin42);
    if (!friend) {
      throw new NotFoundException(
        `User (friend) with login42 "${friendLogin42}" not found`,
      );
    }

    user.friendRequestsSent = user.friendRequestsSent.filter(
      (curLogin42) => curLogin42 !== friendLogin42,
    );
    friend.friendRequestsReceived = friend.friendRequestsReceived.filter(
      (curLogin42) => curLogin42 !== login42,
    );
    return user.friendRequestsSent;
  }

  acceptFriendRequest(
    login42: string,
    acceptFriendRequestDto: AcceptFriendRequestDto,
  ): Friends {
    const { friendLogin42 } = acceptFriendRequestDto;

    const user: IUser | undefined = this.searchUser(login42);
    if (!user) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }

    const friend: IUser | undefined = this.searchUser(friendLogin42);
    if (!friend) {
      throw new NotFoundException(
        `User (friend) with login42 "${friendLogin42}" not found`,
      );
    }

    user.friends.push(friendLogin42);
    friend.friends.push(login42);
    user.friendRequestsReceived = user.friendRequestsReceived.filter(
      (curLogin42) => curLogin42 !== friendLogin42,
    );
    friend.friendRequestsSent = friend.friendRequestsSent.filter(
      (curLogin42) => curLogin42 !== login42,
    );

    return user.friends;
  }

  declineFriendRequest(
    login42: string,
    acceptFriendRequestDto: AcceptFriendRequestDto,
  ): Friends {
    const { friendLogin42 } = acceptFriendRequestDto;

    const user: IUser | undefined = this.searchUser(login42);
    if (!user) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }

    const friend: IUser | undefined = this.searchUser(friendLogin42);
    if (!friend) {
      throw new NotFoundException(
        `User (friend) with login42 "${friendLogin42}" not found`,
      );
    }

    user.friendRequestsReceived = user.friendRequestsReceived.filter(
      (curLogin42) => curLogin42 !== friendLogin42,
    );
    friend.friendRequestsSent = friend.friendRequestsSent.filter(
      (curLogin42) => curLogin42 !== login42,
    );

    return user.friends;
  }

  removeFriend(
    login42: string,
    acceptFriendRequestDto: AcceptFriendRequestDto,
  ): Friends {
    const { friendLogin42 } = acceptFriendRequestDto;

    const user: IUser | undefined = this.searchUser(login42);
    if (!user) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }

    const friend: IUser | undefined = this.searchUser(friendLogin42);
    if (!friend) {
      throw new NotFoundException(
        `User (friend) with login42 "${friendLogin42}" not found`,
      );
    }

    user.friends = user.friends.filter(
      (curLogin42) => curLogin42 !== friendLogin42,
    );
    friend.friends = friend.friends.filter(
      (curLogin42) => curLogin42 !== login42,
    );

    return user.friends;
  }

  updateUserElo(
    login42: string,
    updateUserEloDto: UpdateUserEloDto,
  ): IUserPublicInfos {
    const { elo } = updateUserEloDto;
    const user: IUser | undefined = this.searchUser(login42);
    if (!user) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }
    user.elo = user.elo + elo;
    return this.createUserPublicInfos(user);
  }

  updateUserUsername(
    login42: string,
    updateUserUsernameDto: UpdateUserUsernameDto,
  ): IUserPublicInfos {
    const { username } = updateUserUsernameDto;
    const user: IUser | undefined = this.searchUser(login42);
    if (!user) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }
    user.username = username;
    return this.createUserPublicInfos(user);
  }

  updateUserGamesWon(
    login42: string,
    updateUserGamesWonDto: UpdateUserGamesWonDto,
  ): IUserPublicInfos {
    const { gamesWon } = updateUserGamesWonDto;
    const user: IUser | undefined = this.searchUser(login42);
    if (!user) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }
    user.gamesWon = gamesWon;
    return this.createUserPublicInfos(user);
  }

  updateUserGamesLost(
    login42: string,
    updateUserGamesLostDto: UpdateUserGamesLostDto,
  ): IUserPublicInfos {
    const { gamesLost } = updateUserGamesLostDto;
    const user: IUser | undefined = this.searchUser(login42);
    if (!user) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }
    user.gamesLost = gamesLost;
    return this.createUserPublicInfos(user);
  }
}
