import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { User, UserInfos } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserStatus } from './user-status.enum';

@Injectable()
export class UsersService {
  private users: User[] = [];

  getAllUsers() {
    return this.users.map((user) => {
      const ret: UserInfos = {
        id: user.id,
        login: user.login,
        level: user.level,
        ranking: user.ranking,
        gamesWon: user.gamesWon,
        gamesLost: user.gamesLost,
      };
      return ret;
    });
  }

  createUser(createUserDto: CreateUserDto): UserInfos {
    const { login, password } = createUserDto;
    const user: User = {
      id: uuid(),
      login,
      password,
      status: UserStatus.IS_GUEST,
      level: 0,
      ranking: 0,
      gamesWon: 0,
      gamesLost: 0,
      twoFa: false,
    };
    if (!this.searchUser(login)) {
      this.users.push(user);
      const ret: UserInfos = {
        id: user.id,
        login: user.login,
        level: user.level,
        ranking: user.ranking,
        gamesWon: user.gamesWon,
        gamesLost: user.gamesLost,
      };
      return ret;
    }
  }

  private searchUser(login: string): User {
    return this.users.find((user) => user.login == login);
  }

  getUserInfos(login: string): UserInfos {
    const input: User = this.searchUser(login);
    if (input) {
      const ret: UserInfos = {
        id: input.id,
        login: input.login,
        level: input.level,
        ranking: input.ranking,
        gamesWon: input.gamesWon,
        gamesLost: input.gamesLost,
      };
      return ret;
    }
  }

  updateUserRanking(login: string, ranking: number): UserInfos {
    const input: User = this.searchUser(login);
    if (input) {
      console.log(ranking);
      input.ranking = input.ranking + ranking;
      const ret: UserInfos = {
        id: input.id,
        login: input.login,
        level: input.level,
        ranking: input.ranking,
        gamesWon: input.gamesWon,
        gamesLost: input.gamesLost,
      };
      console.log(ret);
      return ret;
    }
  }

  updateUserUsername(login: string, username: string): UserInfos {
    const input: User = this.searchUser(login);
    console.log(input, login, username);
    if (input) {
      console.log(username);
      input.login = username;
      const ret: UserInfos = {
        id: input.id,
        login: input.login,
        level: input.level,
        ranking: input.ranking,
        gamesWon: input.gamesWon,
        gamesLost: input.gamesLost,
      };
      console.log(ret);
      return ret;
    }
  }
}
