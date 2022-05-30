import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PrivateConvService } from "src/privateConv/privateConv.service";
import { User } from "src/users/user.entity";
import { UsersService } from "src/users/users.service";
import { threadId } from "worker_threads";
import { Channel } from "./channel.entity";
import { ChannelRepository } from "./channel.repository";
import {
  ChannelIdDto,
  ChannelInfoDto,
  InteractionDto,
  JoinProtectedChannelDto,
  RestrictionDto,
  SendMessageDto,
} from "./dto/channel.dto";

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(ChannelRepository)
    private readonly channelRepository: ChannelRepository,
    private readonly usersService: UsersService,
    private readonly privateConvService: PrivateConvService
  ) {}

  async createChannel(
    login42: string,
    createChannelDto: ChannelInfoDto
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.createChannel(user, createChannelDto);
  }

  async updateChannel(
    login42: string,
    channelId: string,
    updateChannelDto: ChannelInfoDto
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.updateChannel(
      user,
      channelId,
      updateChannelDto
    );
  }

  async joinProtectedChannel(
    login42: string,
    joinProtectedChannelDto: JoinProtectedChannelDto
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.joinProtectedChannel(
      user,
      joinProtectedChannelDto
    );
  }

  async joinChannel(
    login42: string,
    joinChannelDto: ChannelIdDto
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.joinChannel(user, joinChannelDto);
  }

  async inviteToChannel(
    login42: string,
    inviteToChannelDto: InteractionDto
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    const channel = await this.channelRepository.findOne({
      relations: ["users"],
      where: {
        id: inviteToChannelDto.channelId,
      },
    });

    if (!channel) {
      throw new Error("Channel not found");
    }
    this.channelRepository.resolveChannelRestrictions(channel);

    if (channel.invitations.includes(inviteToChannelDto.userLogin42)) {
      return channel;
    }
    if (
      channel.users.find(
        ({ login42 }) => login42 === inviteToChannelDto.userLogin42
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
    leaveChannelDto: ChannelIdDto
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    const channel = await this.channelRepository.findOne({
      relations: ["users"],
      where: {
        id: leaveChannelDto.channelId,
      },
    });

    if (!channel) {
      throw new Error("Channel not found");
    }

    channel.users = channel.users.filter(
      (channelUser) => channelUser.login42 !== user.login42
    );
    channel.admins = channel.admins.filter(
      (channelAdmin) => channelAdmin !== user.login42
    );
    if (channel.owner === user.login42) {
      if (channel.admins.length > 0) {
        const firstAdmin = await this.usersService.getUserByLogin42(
          channel.admins[0]
        );
        channel.owner = firstAdmin.login42;
      } else {
        this.channelRepository.delete(channel.id);
        return channel;
      }
    }
    await this.channelRepository.save(channel);
    return channel;
  }

  async muteAChannelUser(
    login42: string,
    muteAChannelUserDto: RestrictionDto
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.muteAChannelUser(user, muteAChannelUserDto);
  }

  async banAChannelUser(
    login42: string,
    banAChannelUserDto: RestrictionDto
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    this.channelRepository.banAChannelUser(user, banAChannelUserDto);
	return this.leaveChannel(banAChannelUserDto.userLogin42, {
		channelId: banAChannelUserDto.channelId,
		});
  }

  async setAChannelAdmin(
    login42: string,
    setAChannelAdminDto: InteractionDto
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.setAChannelAdmin(user, setAChannelAdminDto);
  }

  async unsetAChannelAdmin(
    login42: string,
    unsetAChannelAdminDto: InteractionDto
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.unsetAChannelAdmin(
      user,
      unsetAChannelAdminDto
    );
  }

  async sendMSGToChannel(
    login42: string,
    sendMSGToChannelDto: SendMessageDto
  ): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.sendMSGToChannel(user, sendMSGToChannelDto);
  }

  async getChannel(login42: string, channelId: string): Promise<Channel> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.getChannel(user, channelId);
  }

  async getInvitableFriends(
    login42: string,
    channelId: string
  ): Promise<User[]> {
    const user = await this.usersService.getUserByLogin42(login42);
    const userFriends = await this.usersService.getUserFriends(
      user,
      user.login42
    );
    return this.channelRepository.getInvitableFriends(
      user,
      userFriends,
      channelId
    );
  }

  async getPublicChannels(login42: string): Promise<Channel[]> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.getPublicChannels(user);
  }

  async getJoinedChannels(login42: string): Promise<Channel[]> {
    const user = await this.usersService.getUserByLogin42(login42);
    return this.channelRepository.getJoinedChannels(user);
  }
}
