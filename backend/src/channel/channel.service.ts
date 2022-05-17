import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { ChannelRepository } from './channel.repository';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(ChannelRepository)
    private readonly channelRepository: ChannelRepository,
    private readonly usersService: UsersService,
  ) {}
}
