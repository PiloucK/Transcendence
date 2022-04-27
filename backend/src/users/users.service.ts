import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import {
  UpdateUserEloDto,
  UpdateUserGamesLostDto,
  UpdateUserGamesWonDto,
  UpdateUserUsernameDto,
} from './dto/update-user.dto';
import {
  AcceptFriendRequestDto,
  FriendDto,
  SendFriendRequestDto,
} from './dto/user-friends.dto';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}
  // to split when using the db: UsersService and UsersFriendsService

  // private createUserPublicInfos(user: IUser): IUserPublicInfos {
  //   const ret: IUserPublicInfos = {
  //     login42: user.login42,
  //     username: user.username,
  //     elo: user.elo,
  //     gamesWon: user.gamesWon,
  //     gamesLost: user.gamesLost,
  //   };
  //   return ret;
  // }

  async getAllUsers(): Promise<User[]> {
    const users = await this.usersRepository.find({
      relations: ['friends', 'friendRequestsSent', 'friendRequestsReceived'],
    });
    return users;
  }

  // getUsersForLeaderboard(): IUserForLeaderboard[] {
  //   return this.users
  //     .map((user) => {
  //       const ret: IUserForLeaderboard = {
  //         login42: user.login42,
  //         username: user.username,
  //         elo: user.elo,
  //       };
  //       return ret;
  //     })
  //     .sort((a, b) => a.elo - b.elo);
  // }

  // private searchUser(login42: string): IUser | undefined {
  //   return this.users.find((user) => user.login42 == login42);
  // }

  async getUserByLogin(login42: string): Promise<User> {
    const user = await this.usersRepository.findOne(login42, {
      relations: ['friends', 'friendRequestsSent', 'friendRequestsReceived'],
    });
    if (!user) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }
    return user;
  }

  async getUserFriends(login42: string): Promise<User[]> {
    const user = await this.getUserByLogin(login42);
    return user.friends;
  }

  createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.createUser(createUserDto);
  }

  async deleteUser(login42: string): Promise<void> {
    const result = await this.usersRepository.delete(login42);

    if (result.affected === 0) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }
  }

  async addFriend(login42: string, friendDto: FriendDto): Promise<void> {
    const { friendLogin42 } = friendDto;
    const user = await this.getUserByLogin(login42);
    const friend = await this.getUserByLogin(friendLogin42);
    if (user.login42 !== friend.login42) {
      user.friends = user.friends.concat(friend);
      await this.usersRepository.save(user);
      friend.friends = friend.friends.concat(user);
      await this.usersRepository.save(friend);
    }
  }

  async sendFriendRequest(
    login42: string,
    sendFriendRequestDto: SendFriendRequestDto,
  ): Promise<User[]> {
    const { friendLogin42 } = sendFriendRequestDto;

    const user = await this.getUserByLogin(login42);
    const friend = await this.getUserByLogin(friendLogin42);

    if (user.login42 !== friend.login42) {
      user.friendRequestsSent = user.friendRequestsSent.concat(friend);
      await this.usersRepository.save(user);

      friend.friendRequestsReceived =
        friend.friendRequestsReceived.concat(user);
      await this.usersRepository.save(friend);
    }

    return user.friendRequestsSent;
  }

  async acceptFriendRequest(
    login42: string,
    acceptFriendRequestDto: AcceptFriendRequestDto,
  ): Promise<User[]> {
    const { friendLogin42 } = acceptFriendRequestDto;

    const user = await this.getUserByLogin(login42);
    const friend = await this.getUserByLogin(friendLogin42);

    if (user.login42 !== friend.login42) {
      user.friends = user.friends.concat(friend);
      user.friendRequestsReceived = user.friendRequestsReceived.filter(
        (curUser) => curUser.login42 !== friendLogin42,
      );
      await this.usersRepository.save(user);

      friend.friends = [...friend.friends, user];
      friend.friendRequestsSent = friend.friendRequestsSent.filter(
        (curUser) => curUser.login42 !== login42,
      );
      await this.usersRepository.save(friend);
    }

    return user.friends;
  }

  async updateUserElo(
    login42: string,
    updateUserEloDto: UpdateUserEloDto,
  ): Promise<User> {
    const { elo } = updateUserEloDto;
    const user = await this.getUserByLogin(login42);
    user.elo = elo;
    await this.usersRepository.save(user);
    return user;
  }

  async updateUserUsername(
    login42: string,
    updateUserUsernameDto: UpdateUserUsernameDto,
  ): Promise<User> {
    const { username } = updateUserUsernameDto;
    const user = await this.getUserByLogin(login42);
    user.username = username;
    await this.usersRepository.save(user);
    return user;
  }

  async updateUserGamesWon(
    login42: string,
    updateUserGamesWonDto: UpdateUserGamesWonDto,
  ): Promise<User> {
    const { gamesWon } = updateUserGamesWonDto;
    const user = await this.getUserByLogin(login42);
    user.gamesWon = gamesWon;
    await this.usersRepository.save(user);
    return user;
  }

  async updateUserGamesLost(
    login42: string,
    updateUserGamesLostDto: UpdateUserGamesLostDto,
  ): Promise<User> {
    const { gamesLost } = updateUserGamesLostDto;
    const user = await this.getUserByLogin(login42);
    user.gamesLost = gamesLost;
    await this.usersRepository.save(user);
    return user;
  }
}
