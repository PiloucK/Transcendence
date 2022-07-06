import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PrivateConvService } from 'src/privateConv/privateConv.service';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { threadId } from 'worker_threads';
import { Channel } from './channel.entity';
import {
  ChannelIdDto,
  ChannelInfoDto,
  InteractionDto,
  JoinProtectedChannelDto,
  RestrictionDto,
  SendMessageDto,
} from './dto/channel.dto';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    private readonly usersService: UsersService,
    private readonly privateConvService: PrivateConvService,
    private readonly configService: ConfigService,
  ) {}

  async createChannelInDatabase(
    user: User,
    createChannelDto: ChannelInfoDto,
  ): Promise<Channel> {
    const channel = this.channelRepository.create({
      ...createChannelDto,
      owner: user.login42,
      admins: [user.login42],
      muted: [],
      banned: [],
      messages: [],
      invitations: [],
      users: [user],
    });
    await this.channelRepository.save(channel);
    return channel;
  }

  async createChannel(
    login42: string,
    createChannelDto: ChannelInfoDto,
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.createChannelInDatabase(user, createChannelDto);
  }

  resolveChannelRestrictions(channel: Channel): void {
    channel.muted?.forEach(({ login, until }) => {
      if (until < Date.now()) {
        channel.muted = channel.muted?.filter(
          (curMuted) => curMuted.login !== login,
        );
      }
    });
    channel.banned?.forEach(({ login, until }) => {
      if (until < Date.now()) {
        channel.banned = channel.banned?.filter(
          (curBanned) => curBanned.login !== login,
        );
      }
    });
  }

  async updateChannelInDatabase(
    user: User,
    channelId: string,
    updateChannelDto: ChannelInfoDto,
  ): Promise<Channel> {
    const channel = await this.channelRepository.findOne({
      where: {
        id: channelId,
        owner: user.login42,
      },
    });

    if (!channel) {
      throw new Error('Channel not found');
    }
    this.resolveChannelRestrictions(channel);

    channel.name = updateChannelDto.name;
	if (updateChannelDto.setPassword === true) {
		channel.password = updateChannelDto.password;
	}
    channel.isPrivate = updateChannelDto.isPrivate;

    await this.channelRepository.save(channel);
    return channel;
  }
  async updateChannel(
    login42: string,
    channelId: string,
    updateChannelDto: ChannelInfoDto,
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.updateChannelInDatabase(user, channelId, updateChannelDto);
  }

  async updateChannelImage(
    login42: string,
    channelId: string,
    file: Express.Multer.File,
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    const channel = await this.channelRepository.findOne({
      where: {
        id: channelId,
      },
    });
    if (!channel) {
      throw new Error('Channel not found');
    }
    if (channel.owner !== user.login42) {
      throw new Error('You are not the owner of this channel');
    }
    channel.image =
      `http://${this.configService.get('HOST')}:${this.configService.get(
        'BACKEND_PORT',
      )}/channel/image/` +
      channelId +
      '/' +
      file.filename;
    await this.channelRepository.save(channel);
    return channel;
  }

  async joinProtectedChannelInDatabase(
    user: User,
    joinProtectedChannelDto: JoinProtectedChannelDto,
  ): Promise<Channel> {
    const channel = await this.channelRepository.findOne({
      relations: ['users'],
      where: {
        id: joinProtectedChannelDto.channelId,
        password: joinProtectedChannelDto.password,
      },
    });

    if (!channel) {
      throw new Error('Channel not found');
    }
    this.resolveChannelRestrictions(channel);

    if (
      channel.banned?.find((bannedUser) => bannedUser.login === user.login42)
    ) {
      throw new Error('You are banned from this channel');
    }
    if (channel.users.find(({ login42 }) => login42 === user.login42)) {
      return channel;
    }
    channel.users.push(user);
    channel.invitations = channel.invitations.filter(
      (invitedUser) => invitedUser !== user.login42,
    );
    await this.channelRepository.save(channel);
    return channel;
  }

  async joinProtectedChannel(
    login42: string,
    joinProtectedChannelDto: JoinProtectedChannelDto,
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.joinProtectedChannelInDatabase(user, joinProtectedChannelDto);
  }

  async joinChannelInDatabase(
    user: User,
    joinChannelDto: ChannelIdDto,
  ): Promise<Channel> {
    const channel = await this.channelRepository.findOne({
      relations: ['users'],
      where: {
        id: joinChannelDto.channelId,
      },
    });

    if (!channel) {
      throw new Error('Channel not found');
    }
    this.resolveChannelRestrictions(channel);

    if (
      channel.banned?.find((bannedUser) => bannedUser.login === user.login42)
    ) {
      throw new Error('You are banned from this channel');
    }
    if (channel.users.find(({ login42 }) => login42 === user.login42)) {
      return channel;
    }
    channel.users.push(user);
    channel.invitations = channel.invitations.filter(
      (invitedUser) => invitedUser !== user.login42,
    );
    await this.channelRepository.save(channel);
    return channel;
  }

  async joinChannel(
    login42: string,
    joinChannelDto: ChannelIdDto,
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.joinChannelInDatabase(user, joinChannelDto);
  }

  async inviteToChannel(
    login42: string,
    inviteToChannelDto: InteractionDto,
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    const channel = await this.channelRepository.findOne({
      relations: ['users'],
      where: {
        id: inviteToChannelDto.channelId,
      },
    });

    if (!channel) {
      throw new Error('Channel not found');
    }
    this.resolveChannelRestrictions(channel);

    if (
      channel.owner !== user.login42 &&
      !channel.admins.includes(user.login42)
    )
      throw new Error('Only admins can invite friends');
    if (channel.invitations.includes(inviteToChannelDto.userLogin42)) {
      return channel;
    }
    if (
      channel.users.find(
        ({ login42 }) => login42 === inviteToChannelDto.userLogin42,
      )
    ) {
      return channel;
    }
    channel.invitations.push(inviteToChannelDto.userLogin42);

    const invitation = {
      author: login42,
      channelId: channel.id,
    };

    this.privateConvService.sendChannelInvite({
      sender: login42,
      receiver: inviteToChannelDto.userLogin42,
      invitation,
    });

    await this.channelRepository.save(channel);
    return channel;
  }

  async leaveChannel(
    login42: string,
    leaveChannelDto: ChannelIdDto,
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    const channel = await this.channelRepository.findOne({
      relations: ['users'],
      where: {
        id: leaveChannelDto.channelId,
      },
    });

    if (!channel) {
      throw new Error('Channel not found');
    }

    channel.users = channel.users.filter(
      (channelUser) => channelUser.login42 !== user.login42,
    );
    channel.admins = channel.admins.filter(
      (channelAdmin) => channelAdmin !== user.login42,
    );
    if (channel.owner === user.login42) {
      if (channel.users.length <= 0) {
        this.channelRepository.delete(channel.id);
        return channel;
      } else if (channel.admins.length > 0) {
        const firstAdmin = await this.usersService.getUserByLogin42(
          channel.admins[0],
        );
        channel.owner = firstAdmin.login42;
      } else {
        channel.owner = channel.users[0].login42;
        channel.admins.push(channel.users[0].login42);
      }
    }
    await this.channelRepository.save(channel);
    return channel;
  }

  async muteAChannelUserInDatabase(
    user: User,
    muteAChannelUserDto: RestrictionDto,
  ): Promise<Channel> {
    const channel = await this.channelRepository.findOne({
      where: {
        id: muteAChannelUserDto.channelId,
      },
    });

    if (!channel) {
      throw new Error('Channel not found');
    }
    this.resolveChannelRestrictions(channel);

    if (
      channel.owner !== user.login42 &&
      !channel.admins.includes(user.login42)
    ) {
      throw new Error('You are not an admin of this channel');
    }
    if (channel.owner === muteAChannelUserDto.userLogin42) {
      throw new Error('You are not allowed to mute the owner');
    }
    channel.muted?.push({
      login: muteAChannelUserDto.userLogin42,
      until: muteAChannelUserDto.duration * 1000 + Date.now(),
    });
    await this.channelRepository.save(channel);
    return channel;
  }

  async muteAChannelUser(
    login42: string,
    muteAChannelUserDto: RestrictionDto,
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.muteAChannelUserInDatabase(user, muteAChannelUserDto);
  }

  async banAChannelUserInDatabase(
    user: User,
    banAChannelUserDto: RestrictionDto,
  ): Promise<Channel> {
    const channel = await this.channelRepository.findOne({
      where: {
        id: banAChannelUserDto.channelId,
      },
    });

    if (!channel) {
      throw new Error('Channel not found');
    }
    this.resolveChannelRestrictions(channel);

    if (
      channel.owner !== user.login42 &&
      !channel.admins.includes(user.login42)
    ) {
      throw new Error('You are not an admin of this channel');
    }
    if (channel.owner === banAChannelUserDto.userLogin42) {
      throw new Error('You are not allowed to ban the owner');
    }
    channel.banned?.push({
      login: banAChannelUserDto.userLogin42,
      until: banAChannelUserDto.duration * 1000 + Date.now(),
    });
    await this.channelRepository.save(channel);
    return channel;
  }

  async banAChannelUser(
    login42: string,
    banAChannelUserDto: RestrictionDto,
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    this.banAChannelUserInDatabase(user, banAChannelUserDto);
    return this.leaveChannel(banAChannelUserDto.userLogin42, {
      channelId: banAChannelUserDto.channelId,
    });
  }

  async setAChannelAdminInDatabase(
    user: User,
    setAChannelAdminDto: InteractionDto,
  ): Promise<Channel> {
    const channel = await this.channelRepository.findOne({
      where: {
        id: setAChannelAdminDto.channelId,
        owner: user.login42,
      },
    });

    if (!channel) {
      throw new Error('Channel not found');
    }
    this.resolveChannelRestrictions(channel);

    if (channel.owner !== user.login42) {
      throw new Error('You are not the owner of this channel');
    }
    if (channel.admins.includes(setAChannelAdminDto.userLogin42)) {
      return channel;
    }
    channel.admins.push(setAChannelAdminDto.userLogin42);
    await this.channelRepository.save(channel);
    return channel;
  }

  async setAChannelAdmin(
    login42: string,
    setAChannelAdminDto: InteractionDto,
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.setAChannelAdminInDatabase(user, setAChannelAdminDto);
  }

  async unsetAChannelAdminInDatabase(
    user: User,
    unsetAChannelAdminDto: InteractionDto,
  ): Promise<Channel> {
    const channel = await this.channelRepository.findOne({
      where: {
        id: unsetAChannelAdminDto.channelId,
        owner: user.login42,
      },
    });

    if (!channel) {
      throw new Error('Channel not found');
    }
    this.resolveChannelRestrictions(channel);

    if (channel.owner !== user.login42) {
      throw new Error('You are not the owner of this channel');
    }
    if (!channel.admins.includes(unsetAChannelAdminDto.userLogin42)) {
      return channel;
    }
    channel.admins = channel.admins.filter(
      (channelAdmin) => channelAdmin !== unsetAChannelAdminDto.userLogin42,
    );
    await this.channelRepository.save(channel);
    return channel;
  }

  async unsetAChannelAdmin(
    login42: string,
    unsetAChannelAdminDto: InteractionDto,
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.unsetAChannelAdminInDatabase(user, unsetAChannelAdminDto);
  }

  async sendMSGToChannelInDatabase(
    user: User,
    sendMSGToChannelDto: SendMessageDto,
  ): Promise<Channel> {
    const channel = await this.channelRepository.findOne({
      relations: ['users'],
      where: {
        id: sendMSGToChannelDto.channelId,
      },
    });

    if (!channel) {
      throw new Error('Channel not found');
    }
    this.resolveChannelRestrictions(channel);

    if (channel.banned?.find(({ login }) => login === user.login42)) {
      throw new ForbiddenException('You are banned from this channel');
    }
    if (channel.muted?.find(({ login }) => login === user.login42)) {
      throw new ForbiddenException('You are muted from this channel');
    }
    if (!channel.users.find(({ login42 }) => login42 === user.login42)) {
      throw new ForbiddenException('You are not in this channel');
    }
    channel.messages.push(sendMSGToChannelDto.message);
    await this.channelRepository.save(channel);
    return channel;
  }

  async sendMSGToChannel(
    login42: string,
    sendMSGToChannelDto: SendMessageDto,
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.sendMSGToChannelInDatabase(user, sendMSGToChannelDto);
  }

  async getChannelInDatabase(user: User, channelId: string): Promise<Channel> {
    const channel = await this.channelRepository.findOne({
      relations: ['users'],
      where: {
        id: channelId,
      },
    });

    if (!channel) {
      throw new Error('Channel not found');
    }
    this.resolveChannelRestrictions(channel);

    if (
      typeof user.blockedUsers !== undefined &&
      user.blockedUsers?.length > 0
    ) {
      channel.messages = channel.messages.filter(
        (message) =>
          !user.blockedUsers
            .map((user) => user.login42)
            .includes(message.author),
      );
    }
    return channel;
  }
  async getChannel(login42: string, channelId: string): Promise<Channel> {
    const user = await this.usersService.getUserWithRelations(login42, [
      'blockedUsers',
    ]);
    return this.getChannelInDatabase(user, channelId);
  }

  async getInvitableFriendsInDatabase(
    user: User,
    userFriends: User[],
    channelId: string,
  ): Promise<User[]> {
    const channel = await this.channelRepository.findOne({
      relations: ['users'],
      where: {
        id: channelId,
      },
    });

    if (!channel) {
      throw new Error('Channel not found');
    }
    this.resolveChannelRestrictions(channel);

    const invitableFriends: User[] = userFriends.filter(
      (friend) =>
        !channel.users.find(({ login42 }) => login42 === friend.login42) &&
        !channel.invitations.includes(friend.login42) &&
        !channel.banned?.find(({ login }) => login === friend.login42),
    );

    return invitableFriends;
  }

  async getInvitableFriends(
    login42: string,
    channelId: string,
  ): Promise<User[]> {
    const user = await this.usersService.getUserByLogin42(login42);
    const userFriends = await this.usersService.getUserFriends(
      user,
      user.login42,
    );
    return this.getInvitableFriendsInDatabase(user, userFriends, channelId);
  }

  async getPublicChannelsInDatabase(user: User): Promise<Channel[]> {
    const channels = await this.channelRepository.find({
      where: {
        isPrivate: false,
      },
    });

    const publicChannels = channels.filter((channel) => {
      this.resolveChannelRestrictions(channel);
      return !channel.banned.find(({ login }) => login === user.login42);
    });
    return publicChannels;
  }

  async getPublicChannels(login42: string): Promise<Channel[]> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.getPublicChannelsInDatabase(user);
  }
  async getJoinedChannelsInDatabase(user: User): Promise<Channel[]> {
    return await this.channelRepository
      .createQueryBuilder('channel')
      .leftJoin('channel.users', 'user')
      .where('user.login42 = :login', { login: user.login42 })
      .getMany();
  }

  async getJoinedChannels(login42: string): Promise<Channel[]> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.getJoinedChannelsInDatabase(user);
  }
}
