import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { IUser, IUserForLeaderboard, IUserPublicInfos } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import {
  UpdateUserEloDto,
  UpdateUserGamesLostDto,
  UpdateUserGamesWonDto,
  UpdateUserUsernameDto,
} from './dto/update-user.dto';
import { SendFriendRequestDto } from './dto/user-friends.dto';

@Injectable()
export class UsersService {
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
<<<<<<< HEAD
					login42: user.login42,
=======
          login42: user.login42,
>>>>>>> origin/LeaderboardToBackToWebsock
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

  createUser(createUserDto: CreateUserDto): IUser {
    const { login42 } = createUserDto;
<<<<<<< HEAD
		let user: IUser | undefined = this.searchUser(login42);
    if (typeof user === 'undefined') {
			user = {
        id: "",
=======
    let user: IUser | undefined = this.searchUser(login42);
    if (!user) {
      user = {
        id: uuid(),
>>>>>>> origin/LeaderboardToBackToWebsock
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
  ): IUser {
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

    return user;
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
