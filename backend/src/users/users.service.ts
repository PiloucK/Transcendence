import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { User, UserForLeaderboard, UserPublicInfos } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserEloDto, UpdateUserUsernameDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private users: User[] = [];

  private createUserPublicInfos(user: User): UserPublicInfos {
    const ret: UserPublicInfos = {
      username: user.username,
      elo: user.elo,
      gamesWon: user.gamesWon,
      gamesLost: user.gamesLost,
    };
    return ret;
  }

  getAllUsers(): UserPublicInfos[] {
    return this.users.map((user) => this.createUserPublicInfos(user));
  }

  getUsersForLeaderboard(): UserForLeaderboard[] {
    return this.users
      .map((user) => {
        const ret: UserForLeaderboard = {
          username: user.username,
          elo: user.elo,
        };
        return ret;
      })
      .sort((a, b) => a.elo - b.elo);
  }

  private searchUser(login42: string): User {
    return this.users.find((user) => user.login42 == login42);
  }

  createUser(createUserDto: CreateUserDto): UserPublicInfos {
    const { login42 } = createUserDto;
    if (!this.searchUser(login42)) {
      const user: User = {
        id: uuid(),
        login42,
        token42: '',
        username: login42,
        elo: 0,
        gamesWon: 0,
        gamesLost: 0,
        twoFa: false,
      };
      this.users.push(user);
      return this.createUserPublicInfos(user);
    }
  }

  getUserById(login42: string): UserPublicInfos {
    const user: User = this.searchUser(login42);
    if (user) {
      return this.createUserPublicInfos(user);
    }
  }

  updateUserElo(
    login42: string,
    updateUserEloDto: UpdateUserEloDto,
  ): UserPublicInfos {
    const { elo } = updateUserEloDto;
    const user: User = this.searchUser(login42);
    if (user) {
      user.elo = elo;
      return this.createUserPublicInfos(user);
    }
  }

  updateUserUsername(
    login42: string,
    updateUserUsernameDto: UpdateUserUsernameDto,
  ): UserPublicInfos {
    const { username } = updateUserUsernameDto;
    const user: User = this.searchUser(login42);
    if (user) {
      user.username = username;
      return this.createUserPublicInfos(user);
    }
  }
}
