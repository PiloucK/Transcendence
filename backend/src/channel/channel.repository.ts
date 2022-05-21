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
} from "./dto/channel.dto";

@EntityRepository(Channel)
export class ChannelRepository extends Repository<Channel> {
  // private resolveChannelRestrictions(channel: Channel): void {
  // 	channel.muted.forEach(({login, until}) => {
  // 		if (until < Date.now()) {
  // 			channel.muted = channel.muted.filter(
  // 				(curMuted) => curMuted.login !== login
  // 			);
  // 		}
  // 	});
  // 	channel.banned.forEach(({login, until}) => {
  // 		if (until < Date.now()) {
  // 			channel.banned = channel.banned.filter(
  // 				(curBanned) => curBanned.login !== login
  // 			);
  // 		}
  // 	});
  // }

  async createChannel(
    user: User,
    createChannelDto: ChannelInfoDto
  ): Promise<Channel> {
    const channel = this.create({
      ...createChannelDto,
      owner: user.login42,
      admins: [user.login42],
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
      id: joinProtectedChannelDto.channelId,
      password: joinProtectedChannelDto.password,
    });

    if (!channel) {
      throw new Error("Channel not found");
    }

    // Throw if banned
    channel.users.push(user);
    // Remove the invitation if it exists
    await this.save(channel);
    return channel;
  }

  async joinChannel(
    user: User,
    joinChannelDto: ChannelIdDto
  ): Promise<Channel> {
    const channel = await this.findOne({
      id: joinChannelDto.channelId,
      owner: user.login42,
    });

    if (!channel) {
      throw new Error("Channel not found");
    }

    // Throw if banned
    channel.users.push(user);
    // Remove the invitation if it exists
    await this.save(channel);
    return channel;
  }

  async inviteToChannel(
    user: User,
    inviteToChannelDto: InteractionDto
  ): Promise<Channel> {
    const channel = await this.findOne({
      id: inviteToChannelDto.channelId,
      owner: user.login42,
    });

    if (!channel) {
      throw new Error("Channel not found");
    }

    // Return if the user is already in or is already invited
    channel.invitations.push(inviteToChannelDto.userLogin42);
    await this.save(channel);
    return channel;
  }

  async leaveChannel(
    user: User,
    leaveChannelDto: ChannelIdDto
  ): Promise<Channel> {
    const channel = await this.findOne({
      id: leaveChannelDto.channelId,
      owner: user.login42,
    });

    if (!channel) {
      throw new Error("Channel not found");
    }

    channel.users = channel.users.filter(
      (channelUser) => channelUser.login42 !== user.login42
    );
    // Remove the user from admins if he is
    // Remove the user from owner and set a new owner if he is
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

    channel.muted.push({
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

    channel.banned.push({
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
      id: sendMSGToChannelDto.channelId,
      owner: user.login42,
    });

    if (!channel) {
      throw new Error("Channel not found");
    }

    channel.messages.push(sendMSGToChannelDto.message);
    await this.save(channel);
    return channel;
  }

	async getChannel(
		user: User,
		channelId: string
	): Promise<Channel> {
		const channel = await this.findOne({
			id: channelId,
			owner: user.login42,
		});

		if (!channel) {
			throw new Error("Channel not found");
		}

		return channel;
	}

	async getInvitableFriends(
		user: User,
		channelId: string
	): Promise<User[]> {
		const channel = await this.findOne({
			id: channelId,
			owner: user.login42,
		});

		if (!channel) {
			throw new Error("Channel not found");
		}

		return channel.users;
	}

	async getPublicChannels(
		user: User
	): Promise<Channel[]> {
		const channels = await this.find({
			isPrivate: false,
		});

		// Remove the channel if the user is banned (or in maybe)
		return channels;
	}

	async getJoinedChannels(
		user: User
	): Promise<Channel[]> {
		const channels = await this.find({
			relations: ["users"],
			where: {
				users: {
					login42: user.login42,
				},
			},
		});

		return channels;
	}

}