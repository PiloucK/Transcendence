import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import {
	FriendRequestsReceived,
  FriendRequestsSent,
  Friends,
  IUser,
  IUserForLeaderboard,
  IUserPublicInfos,
} from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import {
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

    user.friendRequestsSent.push(friendLogin42);
    friend.friendRequestsReceived.push(login42);

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
