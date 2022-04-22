import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { User, UserInfos } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserStatus } from './user-status.enum';

@Injectable()
export class UsersService {
  private users: User[] = [];

  private createUserInfos(user: User): UserInfos {
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

  getAllUsers(): UserInfos[] {
    return this.users.map((user) => this.createUserInfos(user));
  }

  private searchUser(login: string): User {
    return this.users.find((user) => user.login == login);
  }

  createUser(createUserDto: CreateUserDto): UserInfos {
    const { login, password } = createUserDto;
    if (!this.searchUser(login)) {
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
      this.users.push(user);
      return this.createUserInfos(user);
    }
  }

  getUserInfos(login: string): UserInfos {
    const user: User = this.searchUser(login);
    if (user) {
      return this.createUserInfos(user);
    }
  }

  updateUserRanking(login: string, ranking: number): UserInfos {
    const user: User = this.searchUser(login);
    if (user) {
      user.ranking += ranking;
      return this.createUserInfos(user);
    }
  }

  updateUserUsername(login: string, username: string): UserInfos {
    const user: User = this.searchUser(login);
    if (user) {
      user.login = username;
      return this.createUserInfos(user);
    }
  }
}
