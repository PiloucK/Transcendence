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

  // getAllUsers(): IUserPublicInfos[] {
  //   return this.users.map((user) => this.createUserPublicInfos(user));
  // }

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
    const user = await this.usersRepository.findOne(login42);
    if (!user) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }
    return user;
  }

  // getUserFriends(login42: string): IUserPublicInfos[] {
  //   const user: IUser | undefined = this.searchUser(login42);
  //   if (!user) {
  //     throw new NotFoundException(`User with login42 "${login42}" not found`);
  //   }
  //   return user.friends.map((curLogin42) => {
  //     const friend = this.searchUser(curLogin42);
  //     if (!friend) {
  //       throw new NotFoundException(
  //         `User (friend) with login42 "${curLogin42}" not found`,
  //       );
  //     }
  //     return this.createUserPublicInfos(friend);
  //   });
  // }

  createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.createUser(createUserDto);
  }

  async deleteUser(login42: string): Promise<void> {
    const result = await this.usersRepository.delete(login42);

    if (result.affected === 0) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
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

  // updateUserUsername(
  //   login42: string,
  //   updateUserUsernameDto: UpdateUserUsernameDto,
  // ): IUserPublicInfos {
  //   const { username } = updateUserUsernameDto;
  //   const user: IUser | undefined = this.searchUser(login42);
  //   if (!user) {
  //     throw new NotFoundException(`User with login42 "${login42}" not found`);
  //   }
  //   user.username = username;
  //   return this.createUserPublicInfos(user);
  // }

  // updateUserGamesWon(
  //   login42: string,
  //   updateUserGamesWonDto: UpdateUserGamesWonDto,
  // ): IUserPublicInfos {
  //   const { gamesWon } = updateUserGamesWonDto;
  //   const user: IUser | undefined = this.searchUser(login42);
  //   if (!user) {
  //     throw new NotFoundException(`User with login42 "${login42}" not found`);
  //   }
  //   user.gamesWon = gamesWon;
  //   return this.createUserPublicInfos(user);
  // }

  // updateUserGamesLost(
  //   login42: string,
  //   updateUserGamesLostDto: UpdateUserGamesLostDto,
  // ): IUserPublicInfos {
  //   const { gamesLost } = updateUserGamesLostDto;
  //   const user: IUser | undefined = this.searchUser(login42);
  //   if (!user) {
  //     throw new NotFoundException(`User with login42 "${login42}" not found`);
  //   }
  //   user.gamesLost = gamesLost;
  //   return this.createUserPublicInfos(user);
  // }
}
