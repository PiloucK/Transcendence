import { ForbiddenException } from "@nestjs/common";
import { User } from "src/users/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { Channel } from "./channel.entity";
import {
  ChannelIdDto,
  ChannelInfoDto,
  InteractionDto,
  JoinProtectedChannelDto,
  RestrictionDto,
  SendMessageDto,
  Message,
  restriction,
} from "./dto/channel.dto";

@EntityRepository(Channel)
export class ChannelRepository extends Repository<Channel> {
  resolveChannelRestrictions(channel: Channel): void {
    channel.muted?.forEach(({ login, until }) => {
      if (until < Date.now()) {
        channel.muted = channel.muted?.filter(
          (curMuted) => curMuted.login !== login
        );
      }
    });
    channel.banned?.forEach(({ login, until }) => {
      if (until < Date.now()) {
        channel.banned = channel.banned?.filter(
          (curBanned) => curBanned.login !== login
        );
      }
    });
  }

  async createChannel(
    user: User,
    createChannelDto: ChannelInfoDto
  ): Promise<Channel> {
    const channel = this.create({
      ...createChannelDto,
      owner: user.login42,
      admins: [user.login42],
      muted: [],
      banned: [],
      messages: [],
      invitations: [],
      users: [user],
    });
    await this.save(channel);
    return channel;
  }

  async updateChannel(
    user: User,
    channelId: string,
    updateChannelDto: ChannelInfoDto
  ): Promise<Channel> {
    const channel = await this.findOne({
      id: channelId,
      owner: user.login42,
    });

    if (!channel) {
      throw new Error("Channel not found");
    }
    this.resolveChannelRestrictions(channel);

    channel.name = updateChannelDto.name;
    channel.password = updateChannelDto.password;
    channel.isPrivate = updateChannelDto.isPrivate;

    await this.save(channel);
    return channel;
  }

  async joinProtectedChannel(
    user: User,
    joinProtectedChannelDto: JoinProtectedChannelDto
  ): Promise<Channel> {
    const channel = await this.findOne({
      relations: ["users"],
      where: {
        id: joinProtectedChannelDto.channelId,
        password: joinProtectedChannelDto.password,
      },
    });

    if (!channel) {
      throw new Error("Channel not found");
    }
    this.resolveChannelRestrictions(channel);

    if (
      channel.banned?.find((bannedUser) => bannedUser.login === user.login42)
    ) {
      throw new Error("You are banned from this channel");
    }
    if (channel.users.find(({ login42 }) => login42 === user.login42)) {
      return channel;
    }
    channel.users.push(user);
    channel.invitations = channel.invitations.filter(
      (invitedUser) => invitedUser !== user.login42
    );
    await this.save(channel);
    return channel;
  }

  async joinChannel(
    user: User,
    joinChannelDto: ChannelIdDto
  ): Promise<Channel> {
    const channel = await this.findOne({
      relations: ["users"],
      where: {
        id: joinChannelDto.channelId,
        owner: user.login42,
      },
    });

    if (!channel) {
      throw new Error("Channel not found");
    }
    this.resolveChannelRestrictions(channel);

    if (
      channel.banned?.find((bannedUser) => bannedUser.login === user.login42)
    ) {
      throw new Error("You are banned from this channel");
    }
    if (channel.users.find(({ login42 }) => login42 === user.login42)) {
      return channel;
    }
    channel.users.push(user);
    channel.invitations = channel.invitations.filter(
      (invitedUser) => invitedUser !== user.login42
    );
    await this.save(channel);
    return channel;
  }

  async muteAChannelUser(
    user: User,
    muteAChannelUserDto: RestrictionDto
  ): Promise<Channel> {
    const channel = await this.findOne({
      id: muteAChannelUserDto.channelId,
      owner: user.login42,
    });

    if (!channel) {
      throw new Error("Channel not found");
    }
    this.resolveChannelRestrictions(channel);

    if (!channel.admins.includes(user.login42)) {
      throw new Error("You are not an admin of this channel");
    }

    if (
      channel.muted?.find(
        ({ login }) => login === muteAChannelUserDto.userLogin42
      )
    ) {
      return channel;
    }
    channel.muted?.push({
      login: muteAChannelUserDto.userLogin42,
      until: muteAChannelUserDto.duration * 1000 + Date.now(),
    });
    await this.save(channel);
    return channel;
  }

  async banAChannelUser(
    user: User,
    banAChannelUserDto: RestrictionDto
  ): Promise<Channel> {
    const channel = await this.findOne({
      id: banAChannelUserDto.channelId,
      owner: user.login42,
    });

    if (!channel) {
      throw new Error("Channel not found");
    }
    this.resolveChannelRestrictions(channel);

    if (!channel.admins.includes(user.login42)) {
      throw new Error("You are not an admin of this channel");
    }

    if (
      channel.banned?.find(
        ({ login }) => login === banAChannelUserDto.userLogin42
      )
    ) {
      return channel;
    }
    channel.banned?.push({
      login: banAChannelUserDto.userLogin42,
      until: banAChannelUserDto.duration * 1000 + Date.now(),
    });
    await this.save(channel);
    return channel;
  }

  async setAChannelAdmin(
    user: User,
    setAChannelAdminDto: InteractionDto
  ): Promise<Channel> {
    const channel = await this.findOne({
      id: setAChannelAdminDto.channelId,
      owner: user.login42,
    });

    if (!channel) {
      throw new Error("Channel not found");
    }
    this.resolveChannelRestrictions(channel);

    if (channel.owner !== user.login42) {
      throw new Error("You are not the owner of this channel");
    }
    if (channel.admins.includes(setAChannelAdminDto.userLogin42)) {
      return channel;
    }
    channel.admins.push(setAChannelAdminDto.userLogin42);
    await this.save(channel);
    return channel;
  }

  async unsetAChannelAdmin(
    user: User,
    unsetAChannelAdminDto: InteractionDto
  ): Promise<Channel> {
    const channel = await this.findOne({
      id: unsetAChannelAdminDto.channelId,
      owner: user.login42,
    });

    if (!channel) {
      throw new Error("Channel not found");
    }
    this.resolveChannelRestrictions(channel);

    if (channel.owner !== user.login42) {
      throw new Error("You are not the owner of this channel");
    }
    if (!channel.admins.includes(unsetAChannelAdminDto.userLogin42)) {
      return channel;
    }
    channel.admins = channel.admins.filter(
      (channelAdmin) => channelAdmin !== unsetAChannelAdminDto.userLogin42
    );
    await this.save(channel);
    return channel;
  }

  async sendMSGToChannel(
    user: User,
    sendMSGToChannelDto: SendMessageDto
  ): Promise<Channel> {
    const channel = await this.findOne({
      relations: ["users"],
      where: {
        id: sendMSGToChannelDto.channelId,
        owner: user.login42,
      },
    });

    if (!channel) {
      throw new Error("Channel not found");
    }
    this.resolveChannelRestrictions(channel);

    if (channel.banned?.find(({ login }) => login === user.login42)) {
      throw new ForbiddenException("You are banned from this channel");
    }
    if (channel.muted?.find(({ login }) => login === user.login42)) {
      throw new ForbiddenException("You are muted from this channel");
    }
    if (!channel.users.find(({ login42 }) => login42 === user.login42)) {
      throw new ForbiddenException("You are not in this channel");
    }
    channel.messages.push(sendMSGToChannelDto.message);
    await this.save(channel);
    return channel;
  }

  async getChannel(user: User, channelId: string): Promise<Channel> {
    const channel = await this.findOne({
      relations: ["users"],
      where: {
        id: channelId,
        owner: user.login42,
      },
    });

    if (!channel) {
      throw new Error("Channel not found");
    }
    this.resolveChannelRestrictions(channel);

    return channel;
  }

  async getInvitableFriends(
    user: User,
    userFriends: User[],
    channelId: string
  ): Promise<User[]> {
    const channel = await this.findOne({
      relations: ["users"],
      where: {
        id: channelId,
        owner: user.login42,
      },
    });

    if (!channel) {
      throw new Error("Channel not found");
    }
    this.resolveChannelRestrictions(channel);

    const invitableFriends: User[] = userFriends.filter(
      (friend) =>
        !channel.users.find(({ login42 }) => login42 === friend.login42) &&
        !channel.invitations.includes(friend.login42) &&
        !channel.banned?.find(({ login }) => login === friend.login42)
    );

    return invitableFriends;
  }

  async getPublicChannels(user: User): Promise<Channel[]> {
    const channels = await this.find({
      isPrivate: false,
    });

    return channels.filter((channel) => {
      this.resolveChannelRestrictions(channel);
      !channel.banned?.find(({ login }) => login === user.login42);
    });
  }

  async getJoinedChannels(user: User): Promise<Channel[]> {
    return await this.createQueryBuilder("channel")
      .leftJoin("channel.users", "user")
      .where("user.login42 = :login", { login: user.login42 })
      .getMany();
  }
}
