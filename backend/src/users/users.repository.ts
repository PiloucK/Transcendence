import { ConflictException, NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FriendRequestDto } from './dto/user-friends.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async getUserByLoginWithAllRelations(login42: string): Promise<User> {
    const user = await this.findOne(login42, {
      relations: ['friends', 'friendRequestsSent', 'friendRequestsReceived'],
    });
    if (!user) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }
    return user;
  }

  async getUserWithRelations(
    login42: string,
    relations: Array<string>,
  ): Promise<User> {
    const user = await this.findOne(login42, {
      relations: relations,
    });
    if (!user) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { login42 } = createUserDto;

    let user = await this.findOne(login42);
    if (!user) {
      user = this.create({
        login42,
        token42: '', // to fill
        username: login42,
      });

      await this.save(user);
    }

    return user;
  }

  async sendFriendRequest(
    login42: string,
    friendRequestDto: FriendRequestDto,
  ): Promise<User[]> {
    const { friendLogin42 } = friendRequestDto;

    const user = await this.getUserWithRelations(login42, [
      'friends',
      'friendRequestsSent',
      'friendRequestsReceived',
    ]);
    const friend = await this.getUserWithRelations(friendLogin42, [
      'friendRequestsReceived',
    ]);

    if (user.login42 !== friend.login42) {
      if (user.friends.find((friend) => friend.login42 === friendLogin42)) {
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

      user.friendRequestsSent = user.friendRequestsSent.concat(friend);
      await this.save(user);

      friend.friendRequestsReceived =
        friend.friendRequestsReceived.concat(user);
      await this.save(friend);
    }

    friend.friendRequestsReceived = []; // to prevent circular references error
    return user.friendRequestsSent;
  }

  async cancelFriendRequest(
    login42: string,
    friendRequestDto: FriendRequestDto,
  ): Promise<User[]> {
    const { friendLogin42 } = friendRequestDto;

    const user = await this.getUserWithRelations(login42, [
      'friends',
      'friendRequestsSent',
    ]);
    const friend = await this.getUserWithRelations(friendLogin42, [
      'friendRequestsReceived',
    ]);

    if (user.login42 !== friend.login42) {
      if (user.friends.find((friend) => friend.login42 === friendLogin42)) {
        throw new ConflictException(
          `User with login42 ${friendLogin42} is already in your friendlist`,
        );
      }
      user.friendRequestsSent = user.friendRequestsSent.filter(
        (curUser) => curUser.login42 !== friendLogin42,
      );
      await this.save(user);

      friend.friendRequestsReceived = friend.friendRequestsReceived.filter(
        (curUser) => curUser.login42 !== login42,
      );
      await this.save(friend);
    }

    return user.friendRequestsSent;
  }

  async acceptFriendRequest(
    login42: string,
    friendRequestDto: FriendRequestDto,
  ): Promise<User[]> {
    const { friendLogin42 } = friendRequestDto;

    const user = await this.getUserWithRelations(login42, [
      'friends',
      'friendRequestsReceived',
    ]);
    const friend = await this.getUserWithRelations(friendLogin42, [
      'friends',
      'friendRequestsSent',
    ]);

    if (user.login42 !== friend.login42) {
      user.friends = user.friends.concat(friend);
      user.friendRequestsReceived = user.friendRequestsReceived.filter(
        (curUser) => curUser.login42 !== friendLogin42,
      );
      await this.save(user);

      friend.friends = friend.friends.concat(user);
      friend.friendRequestsSent = friend.friendRequestsSent.filter(
        (curUser) => curUser.login42 !== login42,
      );
      await this.save(friend);
    }

    friend.friends = []; // to prevent circular references error
    return user.friends;
  }

  async declineFriendRequest(
    login42: string,
    friendRequestDto: FriendRequestDto,
  ): Promise<User[]> {
    const { friendLogin42 } = friendRequestDto;

    const user = await this.getUserWithRelations(login42, [
      'friendRequestsReceived',
    ]);
    const friend = await this.getUserWithRelations(friendLogin42, [
      'friendRequestsSent',
    ]);

    if (user.login42 !== friend.login42) {
      if (user.friends.find((friend) => friend.login42 === friendLogin42)) {
        throw new ConflictException(
          `User with login42 ${friendLogin42} is already in your friendlist`,
        );
      }
      user.friendRequestsReceived = user.friendRequestsReceived.filter(
        (curUser) => curUser.login42 !== friendLogin42,
      );
      await this.save(user);

      friend.friendRequestsSent = friend.friendRequestsSent.filter(
        (curUser) => curUser.login42 !== login42,
      );
      await this.save(friend);
    }

    return user.friendRequestsReceived;
  }

  async removeFriend(
    login42: string,
    friendRequestDto: FriendRequestDto,
  ): Promise<User[]> {
    const { friendLogin42 } = friendRequestDto;

    const user = await this.getUserWithRelations(login42, ['friends']);
    const friend = await this.getUserWithRelations(friendLogin42, ['friends']);

    if (user.login42 !== friend.login42) {
      user.friends = user.friends.filter(
        (curUser) => curUser.login42 !== friendLogin42,
      );
      await this.save(user);

      friend.friends = friend.friends.filter(
        (curUser) => curUser.login42 !== login42,
      );
      await this.save(friend);
    }

    return user.friends;
  }
}
