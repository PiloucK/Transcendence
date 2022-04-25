import { Injectable } from '@nestjs/common';
// import { v4 as uuid } from 'uuid';
import { IUser, IUserForLeaderboard, IUserPublicInfos } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserEloDto, UpdateUserUsernameDto } from './dto/update-user.dto';

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

  getUserById(login42: string): IUserPublicInfos | undefined {
    const user: IUser | undefined = this.searchUser(login42);
    if (typeof user !== 'undefined') {
      return this.createUserPublicInfos(user);
    } else {
			return undefined;
		}
  }

  createUser(createUserDto: CreateUserDto): IUser {
    const { login42 } = createUserDto;
		let user: IUser | undefined = this.searchUser(login42);
    if (typeof user === 'undefined') {
			user = {
        id: "",
        login42,
        token42: '',
        username: login42,
        elo: 0,
        gamesWon: 0,
        gamesLost: 0,
        twoFa: false,
      };
      this.users.push(user);
    }
		return user;
  }

  updateUserElo(
    login42: string,
    updateUserEloDto: UpdateUserEloDto,
  ): IUserPublicInfos | undefined {
    const { elo } = updateUserEloDto;
    const user: IUser | undefined = this.searchUser(login42);
    if (typeof user !== 'undefined') {
      user.elo = user.elo + elo;
      return this.createUserPublicInfos(user);
    } else {
			return undefined;
		}
  }

  updateUserUsername(
    login42: string,
    updateUserUsernameDto: UpdateUserUsernameDto,
  ): IUserPublicInfos | undefined {
    const { username } = updateUserUsernameDto;
    const user: IUser | undefined = this.searchUser(login42);
    if (typeof user !== 'undefined') {
      user.username = username;
      return this.createUserPublicInfos(user);
    } else {
			return undefined;
		}
  }
}
