import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUsernameDto } from './dto/updateUser.dto';
import { FriendLogin42Dto } from './dto/friendLogin42.dto';
import { ReqUser } from 'src/reqUser.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

  private restrictToReqUser(reqUser: ReqUser, login42: string): void {
    if (reqUser.login42 !== login42) {
      throw new UnauthorizedException(
        `You must have the login42 "${login42}" to make this request.`,
      );
    }
  }

  async turnOnOldTwoFactorAuth(login42: string) {
    const user = await this.getUserByLogin42(login42);
    user.isTwoFactorAuthEnabled = true;
    await this.usersRepository.save(user);
  }

  async turnOnNewTwoFactorAuth(login42: string) {
    const user = await this.getUserByLogin42(login42);
    user.isTwoFactorAuthEnabled = true;
    user.twoFactorAuthSecret = user.twoFactorAuthTemporarySecret;
    await this.usersRepository.save(user);
  }

  async setTwoFactorAuthTemporarySecret(secret: string, login42: string) {
    const user = await this.getUserByLogin42(login42);
    user.twoFactorAuthTemporarySecret = secret;
    await this.usersRepository.save(user);
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users;
  }

  getUserByLogin42(login42: string): Promise<User> {
    return this.usersRepository.getUserWithRelations(login42, []);
  }

  createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.createUser(createUserDto);
  }

  async deleteAllUsers(): Promise<void> {
    const users = await this.getAllUsers();
    await this.usersRepository.remove(users);
  }

  async updateUsername(
    reqUser: ReqUser,
    login42: string,
    updateUsernameDto: UpdateUsernameDto,
  ): Promise<User> {
    this.restrictToReqUser(reqUser, login42);

    const { username } = updateUsernameDto;
    const user = await this.getUserByLogin42(login42);
    user.username = username;
    await this.usersRepository.save(user);
    return user;
  }

  async updateUserElo(login42: string, elo: number): Promise<User> {
    const user = await this.getUserByLogin42(login42);
    user.elo = elo;
    await this.usersRepository.save(user);
    return user;
  }

  async updateUserGamesWon(login42: string, gamesWon: number): Promise<User> {
    const user = await this.getUserByLogin42(login42);
    user.gamesWon = gamesWon;
    await this.usersRepository.save(user);
    return user;
  }

  async updateUserGamesLost(login42: string, gamesLost: number): Promise<User> {
    const user = await this.getUserByLogin42(login42);
    user.gamesLost = gamesLost;
    await this.usersRepository.save(user);
    return user;
  }

  async getUserFriends(reqUser: ReqUser, login42: string): Promise<User[]> {
    this.restrictToReqUser(reqUser, login42);

    const user = await this.usersRepository.getUserWithRelations(login42, [
      'friends',
    ]);
    return user.friends;
  }

  async getUserFriendRequestsSent(
    reqUser: ReqUser,
    login42: string,
  ): Promise<User[]> {
    this.restrictToReqUser(reqUser, login42);

    const user = await this.usersRepository.getUserWithRelations(login42, [
      'friendRequestsSent',
    ]);
    return user.friendRequestsSent;
  }

  async getUserFriendRequestsReceived(
    reqUser: ReqUser,
    login42: string,
  ): Promise<User[]> {
    this.restrictToReqUser(reqUser, login42);

    const user = await this.usersRepository.getUserWithRelations(login42, [
      'friendRequestsReceived',
    ]);
    return user.friendRequestsReceived;
  }

  async sendFriendRequest(
    reqUser: ReqUser,
    login42: string,
    friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    this.restrictToReqUser(reqUser, login42);

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
        `User with login42 "${friendLogin42}" is already in your friendlist`,
      );
    } else if (
      user.friendRequestsReceived.find(
        (friend) => friend.login42 === friendLogin42,
      )
    ) {
      throw new ConflictException(
        `User with login42 "${friendLogin42}" has already sent you a friend request`,
      );
    }

    await this.usersRepository.addUserToFriendRequestsSent(user, friend);
    await this.usersRepository.addUserToFriendRequestsReceived(friend, user);

    friend.friendRequestsReceived = []; // to prevent circular references error
    return user.friendRequestsSent;
  }

  async cancelFriendRequest(
    reqUser: ReqUser,
    login42: string,
    friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    this.restrictToReqUser(reqUser, login42);

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
        `User with login42 "${friendLogin42}" is already in your friendlist`,
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
    reqUser: ReqUser,
    login42: string,
    friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    this.restrictToReqUser(reqUser, login42);

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
    reqUser: ReqUser,
    login42: string,
    friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    this.restrictToReqUser(reqUser, login42);

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
        `User with login42 "${friendLogin42}" is already in your friendlist`,
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
    reqUser: ReqUser,
    login42: string,
    friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    this.restrictToReqUser(reqUser, login42);

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

  async getUserBlockedUsers(
    reqUser: ReqUser,
    login42: string,
  ): Promise<User[]> {
    this.restrictToReqUser(reqUser, login42);

    const user = await this.usersRepository.getUserWithRelations(login42, [
      'blockedUsers',
    ]);
    return user.blockedUsers;
  }

  async blockUser(
    reqUser: ReqUser,
    login42: string,
    friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    this.restrictToReqUser(reqUser, login42);

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
    reqUser: ReqUser,
    login42: string,
    friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    this.restrictToReqUser(reqUser, login42);

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
