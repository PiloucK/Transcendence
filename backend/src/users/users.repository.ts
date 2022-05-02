import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async getUserByLoginWithAllRelations(login42: string): Promise<User> {
    const user = await this.findOne(login42, {
      relations: [
        'friends',
        'friendRequestsSent',
        'friendRequestsReceived',
        'blockedUsers',
      ],
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

  async addUserToFriendRequestsSent(
    user: User,
    userToAdd: User,
  ): Promise<void> {
    user.friendRequestsSent = user.friendRequestsSent.concat(userToAdd);
    await this.save(user);
  }

  async addUserToFriendRequestsReceived(
    user: User,
    userToAdd: User,
  ): Promise<void> {
    user.friendRequestsReceived = user.friendRequestsReceived.concat(userToAdd);
    await this.save(user);
  }

  async removeUserFromFriendRequestsSent(
    user: User,
    userToRemove: User,
  ): Promise<void> {
    user.friendRequestsSent = user.friendRequestsSent.filter(
      (curUser) => curUser.login42 !== userToRemove.login42,
    );
    await this.save(user);
  }

  async removeUserFromFriendRequestsReceived(
    user: User,
    userToRemove: User,
  ): Promise<void> {
    user.friendRequestsReceived = user.friendRequestsReceived.filter(
      (curUser) => curUser.login42 !== userToRemove.login42,
    );
    await this.save(user);
  }

  async addUserToFriends(user: User, userToAdd: User): Promise<void> {
    user.friends = user.friends.concat(userToAdd);
  }

  async removeUserFromFriends(user: User, userToRemove: User): Promise<void> {
    user.friends = user.friends.filter(
      (curUser) => curUser.login42 !== userToRemove.login42,
    );
    await this.save(user);
  }

  async addUserToBlockedUsers(user: User, userToAdd: User): Promise<void> {
    user.blockedUsers = user.blockedUsers.concat(userToAdd);
    await this.save(user);
  }

  async removeUserFromBlockedUsers(
    user: User,
    userToRemove: User,
  ): Promise<void> {
    user.blockedUsers = user.blockedUsers.filter(
      (curUser) => curUser.login42 !== userToRemove.login42,
    );
    await this.save(user);
  }
}