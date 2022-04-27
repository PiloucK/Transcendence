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
    const users = await this.usersRepository.find({ relations: ['friends'] });
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
      relations: ['friends'],
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
      user.friends = [...user.friends, friend];
      await this.usersRepository.save(user);
      friend.friends = [...friend.friends, user];
      await this.usersRepository.save(friend);
    }
  }

  // sendFriendRequest(
  //   login42: string,
  //   sendFriendRequestDto: SendFriendRequestDto,
  // ): FriendRequestsSent {
  //   const { friendLogin42 } = sendFriendRequestDto;

  //   const user: IUser | undefined = this.searchUser(login42);
  //   if (!user) {
  //     throw new NotFoundException(`User with login42 "${login42}" not found`);
  //   }

  //   const friend: IUser | undefined = this.searchUser(friendLogin42);
  //   if (!friend) {
  //     throw new NotFoundException(
  //       `User (friend) with login42 "${friendLogin42}" not found`,
  //     );
  //   }

  //   user.friendRequestsSent.push(friendLogin42);
  //   friend.friendRequestsReceived.push(login42);

  //   return user.friendRequestsSent;
  // }

  // acceptFriendRequest(
  //   login42: string,
  //   acceptFriendRequestDto: AcceptFriendRequestDto,
  // ): Friends {
  //   const { friendLogin42 } = acceptFriendRequestDto;

  //   const user: IUser | undefined = this.searchUser(login42);
  //   if (!user) {
  //     throw new NotFoundException(`User with login42 "${login42}" not found`);
  //   }

  //   const friend: IUser | undefined = this.searchUser(friendLogin42);
  //   if (!friend) {
  //     throw new NotFoundException(
  //       `User (friend) with login42 "${friendLogin42}" not found`,
  //     );
  //   }

  //   user.friends.push(friendLogin42);
  //   friend.friends.push(login42);
  //   user.friendRequestsReceived = user.friendRequestsReceived.filter(
  //     (curLogin42) => curLogin42 !== friendLogin42,
  //   );
  //   friend.friendRequestsSent = friend.friendRequestsSent.filter(
  //     (curLogin42) => curLogin42 !== login42,
  //   );

  //   return user.friends;
  // }

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
