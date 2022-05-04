import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import {
  UpdateUserEloDto,
  UpdateUserGamesLostDto,
  UpdateUserGamesWonDto,
  UpdateUserUsernameDto,
} from './dto/update-user.dto';
import { FriendLogin42Dto } from './dto/friend-login42.dto';

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
      relations: [
        'friends',
        'friendRequestsSent',
        'friendRequestsReceived',
        'blockedUsers',
      ],
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

  // returns an user if called with undefined as argument
  getUserByLogin(login42: string): Promise<User> {
    return this.usersRepository.getUserByLoginWithAllRelations(login42); // all relations?
  }

  createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.createUser(createUserDto);
  }

  async deleteAllUsers(): Promise<void> {
    const users = await this.getAllUsers();
    await this.usersRepository.remove(users);
  }

  async deleteUser(login42: string): Promise<void> {
    const result = await this.usersRepository.delete(login42);

    if (result.affected === 0) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }
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

  async getUserFriends(login42: string): Promise<User[]> {
    const user = await this.usersRepository.getUserWithRelations(login42, [
      'friends',
    ]);
    return user.friends;
  }

  async getUserFriendRequestsSent(login42: string): Promise<User[]> {
    const user = await this.usersRepository.getUserWithRelations(login42, [
      'friendRequestsSent',
    ]);
    return user.friendRequestsSent;
  }

  async getUserFriendRequestsReceived(login42: string): Promise<User[]> {
    const user = await this.usersRepository.getUserWithRelations(login42, [
      'friendRequestsReceived',
    ]);
    return user.friendRequestsReceived;
  }

  async sendFriendRequest(
    login42: string,
    friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    const { friendLogin42 } = friendLogin42Dto;

    const user = await this.usersRepository.getUserWithRelations(login42, [
      'friends',
      'friendRequestsSent',
      'friendRequestsReceived',
    ]);
    const friend = await this.usersRepository.getUserWithRelations(
      friendLogin42,
      ['friendRequestsReceived'],
    );

    if (user.login42 === friend.login42) {
      throw new ConflictException('You cannot add yourself to your friendlist');
    } else if (
      user.friends.find((friend) => friend.login42 === friendLogin42)
    ) {
      throw new ConflictException(
        `User with login42 ${friendLogin42} is already in your friendlist`,
      );
    } else if (
      user.friendRequestsReceived.find(
        (friend) => friend.login42 === friendLogin42,
      )
    ) {
      throw new ConflictException(
        `User with login42 ${friendLogin42} has already sent you a friend request`,
      );
    }

    await this.usersRepository.addUserToFriendRequestsReceived(friend, user);
    await this.usersRepository.addUserToFriendRequestsSent(user, friend);

    friend.friendRequestsReceived = []; // to prevent circular references error
    return user.friendRequestsSent;
  }

  async cancelFriendRequest(
    login42: string,
    friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    const { friendLogin42 } = friendLogin42Dto;

    const user = await this.usersRepository.getUserWithRelations(login42, [
      'friends',
      'friendRequestsSent',
    ]);
    const friend = await this.usersRepository.getUserWithRelations(
      friendLogin42,
      ['friendRequestsReceived'],
    );

    if (user.friends.find((friend) => friend.login42 === friendLogin42)) {
      throw new ConflictException(
        `User with login42 ${friendLogin42} is already in your friendlist`,
      );
    }

    await this.usersRepository.removeUserFromFriendRequestsSent(user, friend);
    await this.usersRepository.removeUserFromFriendRequestsReceived(
      friend,
      user,
    );

    return user.friendRequestsSent;
  }

  async acceptFriendRequest(
    login42: string,
    friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    const { friendLogin42 } = friendLogin42Dto;

    const user = await this.usersRepository.getUserWithRelations(login42, [
      'friends',
      'friendRequestsReceived',
    ]);
    const friend = await this.usersRepository.getUserWithRelations(
      friendLogin42,
      ['friends', 'friendRequestsSent'],
    );

    this.usersRepository.addUserToFriends(user, friend);
    await this.usersRepository.removeUserFromFriendRequestsReceived(
      user,
      friend,
    );

    this.usersRepository.addUserToFriends(friend, user);
    await this.usersRepository.removeUserFromFriendRequestsSent(friend, user);

    friend.friends = []; // to prevent circular references error
    return user.friends;
  }

  async declineFriendRequest(
    login42: string,
    friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    const { friendLogin42 } = friendLogin42Dto;

    const user = await this.usersRepository.getUserWithRelations(login42, [
      'friends',
      'friendRequestsReceived',
    ]);
    const friend = await this.usersRepository.getUserWithRelations(
      friendLogin42,
      ['friendRequestsSent'],
    );

    if (user.friends.find((friend) => friend.login42 === friendLogin42)) {
      throw new ConflictException(
        `User with login42 ${friendLogin42} is already in your friendlist`,
      );
    }

    await this.usersRepository.removeUserFromFriendRequestsReceived(
      user,
      friend,
    );
    await this.usersRepository.removeUserFromFriendRequestsSent(friend, user);

    return user.friendRequestsReceived;
  }

  async removeFriend(
    login42: string,
    friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    const { friendLogin42 } = friendLogin42Dto;

    const user = await this.usersRepository.getUserWithRelations(login42, [
      'friends',
    ]);
    const friend = await this.usersRepository.getUserWithRelations(
      friendLogin42,
      ['friends'],
    );

    await this.usersRepository.removeUserFromFriends(user, friend);
    await this.usersRepository.removeUserFromFriends(friend, user);

    return user.friends;
  }

  async getUserBlockedUsers(login42: string): Promise<User[]> {
    const user = await this.usersRepository.getUserWithRelations(login42, [
      'blockedUsers',
    ]);
    return user.blockedUsers;
  }

  async blockUser(
    login42: string,
    friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    const { friendLogin42 } = friendLogin42Dto;

    const user = await this.usersRepository.getUserWithRelations(login42, [
      'blockedUsers',
    ]);
    const friend = await this.usersRepository.getUserWithRelations(
      friendLogin42,
      [],
    );

    if (user.login42 === friend.login42) {
      throw new ConflictException('You cannot block yourself');
    }

    await this.usersRepository.addUserToBlockedUsers(user, friend);

    return user.blockedUsers;
  }

  async unblockUser(
    login42: string,
    friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    const { friendLogin42 } = friendLogin42Dto;

    const user = await this.usersRepository.getUserWithRelations(login42, [
      'blockedUsers',
    ]);
    const friend = await this.usersRepository.getUserWithRelations(
      friendLogin42,
      [],
    );

    await this.usersRepository.removeUserFromBlockedUsers(user, friend);

    return user.blockedUsers;
  }
}
