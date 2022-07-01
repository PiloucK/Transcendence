import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { User } from './user.entity';

type UserRelations =
  | 'friends'
  | 'friendRequestsSent'
  | 'friendRequestsReceived'
  | 'blockedUsers';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async getUserWithRelations(
    login42: string,
    relations: Array<UserRelations>,
  ): Promise<User> {
    const user = await this.findOne(login42, {
      relations,
    });
    if (!user) {
      throw new NotFoundException(`User with login42 "${login42}" not found`);
    }
    return user;
  }

  async createUser(login42: string, photo42: string): Promise<User> {
//    let user = await this.findOne(login42);
//    if (!user) {
      const user = this.create({
        login42,
        photo42: photo42,
      });

    console.log('yoo', user);

      await this.save(user).catch(() => {
        console.error('sql error, probablement doublon');
      });
//    }

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
