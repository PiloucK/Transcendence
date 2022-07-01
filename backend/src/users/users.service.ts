import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UpdateUsernameDto } from './dto/updateUser.dto';
import { FriendLogin42Dto } from './dto/friendLogin42.dto';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

type UserRelations =
  | 'friends'
  | 'friendRequestsSent'
  | 'friendRequestsReceived'
  | 'blockedUsers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  private restrictToReqUser(reqUser: User, login42: string): void {
    if (reqUser.login42 !== login42) {
      throw new UnauthorizedException(
        `You must have the login42 "${login42}" to make this request.`,
      );
    }
  }

  async turnOnOldTwoFactorAuth(user: User) {
    user.isTwoFactorAuthEnabled = true;
    await this.usersRepository.save(user);
  }

  async turnOnNewTwoFactorAuth(user: User) {
    user.isTwoFactorAuthEnabled = true;
    user.twoFactorAuthSecret = user.twoFactorAuthTemporarySecret;
    await this.usersRepository.save(user);
  }

  async turnOffTwoFactorAuth(user: User) {
    user.isTwoFactorAuthEnabled = false;
    await this.usersRepository.save(user);
  }

  async setTwoFactorAuthTemporarySecret(secret: string, user: User) {
    user.twoFactorAuthTemporarySecret = secret;
    await this.usersRepository.save(user);
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users;
  }

  async getUserWithRelations(
    login42: string,
    relations: Array<UserRelations>,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        login42,
      },
      relations,
    });
    if (!user) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }
    return user;
  }

  getUserByLogin42(login42: string): Promise<User> {
    return this.getUserWithRelations(login42, []);
  }

  getUserWithAllRelations(login42: string): Promise<User> {
    return this.getUserWithRelations(login42, [
      'friends',
      'friendRequestsSent',
      'friendRequestsReceived',
      'blockedUsers',
    ]);
  }

  async createUser(login42: string, photo42: string): Promise<User> {
    let user = await this.usersRepository.findOne({
      where: {
        login42,
      },
    });
    if (!user) {
      user = this.usersRepository.create({
        login42,
        username: login42,
        photo42: photo42,
      });

      await this.usersRepository.save(user);
    }

    return user;
  }

  async deleteAllUsers(): Promise<void> {
    const users = await this.getAllUsers();
    await this.usersRepository.remove(users);
  }

  async updateUsername(
    reqUser: User,
    login42: string,
    updateUsernameDto: UpdateUsernameDto,
  ): Promise<User> {
    this.restrictToReqUser(reqUser, login42);

    const { username } = updateUsernameDto;
    reqUser.username = username;
    await this.usersRepository.save(reqUser);
    return reqUser;
  }

  async updateUserImage(
    reqUser: User,
    login42: string,
    file: Express.Multer.File,
  ): Promise<User> {
    this.restrictToReqUser(reqUser, login42);

    const user = await this.getUserByLogin42(login42);
    user.image =
      `http://${this.configService.get('HOST')}:${this.configService.get(
        'BACKEND_PORT',
      )}/users/image/` + file.filename;
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

  async getUserFriends(reqUser: User, login42: string): Promise<User[]> {
    this.restrictToReqUser(reqUser, login42);

    const user = await this.getUserWithRelations(login42, ['friends']);
    return user.friends;
  }

  async getUserFriendRequestsSent(
    reqUser: User,
    login42: string,
  ): Promise<User[]> {
    this.restrictToReqUser(reqUser, login42);

    const user = await this.getUserWithRelations(login42, [
      'friendRequestsSent',
    ]);
    return user.friendRequestsSent;
  }

  async getUserFriendRequestsReceived(
    reqUser: User,
    login42: string,
  ): Promise<User[]> {
    this.restrictToReqUser(reqUser, login42);

    const user = await this.getUserWithRelations(login42, [
      'friendRequestsReceived',
    ]);
    return user.friendRequestsReceived;
  }

  async addUserToFriendRequestsSent(
    user: User,
    userToAdd: User,
  ): Promise<void> {
    user.friendRequestsSent = user.friendRequestsSent.concat(userToAdd);
    await this.usersRepository.save(user);
  }

  async addUserToFriendRequestsReceived(
    user: User,
    userToAdd: User,
  ): Promise<void> {
    user.friendRequestsReceived = user.friendRequestsReceived.concat(userToAdd);
    await this.usersRepository.save(user);
  }

  async removeUserFromFriendRequestsSent(
    user: User,
    userToRemove: User,
  ): Promise<void> {
    user.friendRequestsSent = user.friendRequestsSent.filter(
      (curUser) => curUser.login42 !== userToRemove.login42,
    );
    await this.usersRepository.save(user);
  }

  async removeUserFromFriendRequestsReceived(
    user: User,
    userToRemove: User,
  ): Promise<void> {
    user.friendRequestsReceived = user.friendRequestsReceived.filter(
      (curUser) => curUser.login42 !== userToRemove.login42,
    );
    await this.usersRepository.save(user);
  }

  async addUserToFriends(user: User, userToAdd: User): Promise<void> {
    user.friends = user.friends.concat(userToAdd);
  }

  async removeUserFromFriends(user: User, userToRemove: User): Promise<void> {
    user.friends = user.friends.filter(
      (curUser) => curUser.login42 !== userToRemove.login42,
    );
    await this.usersRepository.save(user);
  }

  async addUserToBlockedUsers(user: User, userToAdd: User): Promise<void> {
    user.blockedUsers = user.blockedUsers.concat(userToAdd);
    await this.usersRepository.save(user);
  }

  async removeUserFromBlockedUsers(
    user: User,
    userToRemove: User,
  ): Promise<void> {
    user.blockedUsers = user.blockedUsers.filter(
      (curUser) => curUser.login42 !== userToRemove.login42,
    );
    await this.usersRepository.save(user);
  }
  async sendFriendRequest(
    reqUser: User,
    login42: string,
    friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    this.restrictToReqUser(reqUser, login42);

    const { friendLogin42 } = friendLogin42Dto;

    const user = await this.getUserWithRelations(login42, [
      'friends',
      'friendRequestsSent',
      'friendRequestsReceived',
    ]);
    const friend = await this.getUserWithRelations(friendLogin42, [
      'friendRequestsReceived',
    ]);

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

    await this.addUserToFriendRequestsSent(user, friend);
    await this.addUserToFriendRequestsReceived(friend, user);

    friend.friendRequestsReceived = []; // to prevent circular references error
    return user.friendRequestsSent;
  }

  async cancelFriendRequest(
    reqUser: User,
    login42: string,
    friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    this.restrictToReqUser(reqUser, login42);

    const { friendLogin42 } = friendLogin42Dto;

    const user = await this.getUserWithRelations(login42, [
      'friends',
      'friendRequestsSent',
    ]);
    const friend = await this.getUserWithRelations(friendLogin42, [
      'friendRequestsReceived',
    ]);

    if (user.friends.find((friend) => friend.login42 === friendLogin42)) {
      throw new ConflictException(
        `User with login42 "${friendLogin42}" is already in your friendlist`,
      );
    }

    await this.removeUserFromFriendRequestsSent(user, friend);
    await this.removeUserFromFriendRequestsReceived(friend, user);

    return user.friendRequestsSent;
  }

  async acceptFriendRequest(
    reqUser: User,
    login42: string,
    friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    this.restrictToReqUser(reqUser, login42);

    const { friendLogin42 } = friendLogin42Dto;

    const user = await this.getUserWithRelations(login42, [
      'friends',
      'friendRequestsReceived',
    ]);
    const friend = await this.getUserWithRelations(friendLogin42, [
      'friends',
      'friendRequestsSent',
    ]);

    this.addUserToFriends(user, friend);
    await this.removeUserFromFriendRequestsReceived(user, friend);

    this.addUserToFriends(friend, user);
    await this.removeUserFromFriendRequestsSent(friend, user);

    friend.friends = []; // to prevent circular references error
    return user.friends;
  }

  async declineFriendRequest(
    reqUser: User,
    login42: string,
    friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    this.restrictToReqUser(reqUser, login42);

    const { friendLogin42 } = friendLogin42Dto;

    const user = await this.getUserWithRelations(login42, [
      'friends',
      'friendRequestsReceived',
    ]);
    const friend = await this.getUserWithRelations(friendLogin42, [
      'friendRequestsSent',
    ]);

    if (user.friends.find((friend) => friend.login42 === friendLogin42)) {
      throw new ConflictException(
        `User with login42 "${friendLogin42}" is already in your friendlist`,
      );
    }

    await this.removeUserFromFriendRequestsReceived(user, friend);
    await this.removeUserFromFriendRequestsSent(friend, user);

    return user.friendRequestsReceived;
  }

  async removeFriend(
    reqUser: User,
    login42: string,
    friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    this.restrictToReqUser(reqUser, login42);

    const { friendLogin42 } = friendLogin42Dto;

    const user = await this.getUserWithRelations(login42, ['friends']);
    const friend = await this.getUserWithRelations(friendLogin42, ['friends']);

    await this.removeUserFromFriends(user, friend);
    await this.removeUserFromFriends(friend, user);

    return user.friends;
  }

  async getUserBlockedUsers(reqUser: User, login42: string): Promise<User[]> {
    this.restrictToReqUser(reqUser, login42);

    const user = await this.getUserWithRelations(login42, ['blockedUsers']);
    return user.blockedUsers;
  }

  async blockUser(
    reqUser: User,
    login42: string,
    friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    this.restrictToReqUser(reqUser, login42);

    const { friendLogin42 } = friendLogin42Dto;

    const user = await this.getUserWithRelations(login42, ['blockedUsers']);
    const friend = await this.getUserWithRelations(friendLogin42, []);

    if (user.login42 === friend.login42) {
      throw new ConflictException('You cannot block yourself');
    }

    await this.addUserToBlockedUsers(user, friend);

    return user.blockedUsers;
  }

  async unblockUser(
    reqUser: User,
    login42: string,
    friendLogin42Dto: FriendLogin42Dto,
  ): Promise<User[]> {
    this.restrictToReqUser(reqUser, login42);

    const { friendLogin42 } = friendLogin42Dto;

    const user = await this.getUserWithRelations(login42, ['blockedUsers']);
    const friend = await this.getUserWithRelations(friendLogin42, []);

    await this.removeUserFromBlockedUsers(user, friend);

    return user.blockedUsers;
  }
}
