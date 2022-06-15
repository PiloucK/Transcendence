import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { WebsocketsGateway } from 'src/websockets/websockets.gateway';

interface StatusMetrics {
  socketIds: Set<string>;
  status: 'ONLINE' | 'OFFLINE' | 'IN_GAME' | 'IN_QUEUE';
}

type Login42 = string;

@Injectable()
export class StatusService {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => WebsocketsGateway))
    private readonly websocketsGateway: WebsocketsGateway,
  ) {}

  private statuses = new Map<Login42, StatusMetrics>();

  add(socketId: string, userLogin42: string): void {
    const currentUser = this.statuses.get(userLogin42);
    if (!currentUser) {
      this.statuses.set(userLogin42, {
        socketIds: new Set([socketId]),
        status: 'ONLINE',
      });
      this.websocketsGateway.updateRelations();
    } else {
      currentUser.socketIds.add(socketId);
    }
  }

  async remove(socketId: string): Promise<void> {
    const status = await this.statusRepository.findOne(socketId, {
      relations: ['user'],
    });
    if (status) {
      const userLogin42 = status.user.login42;
      await this.statusRepository.remove(status);
      console.log('remove status');
      const user = await this.usersService.getUserWithStatus(userLogin42);
      if (user.status.length === 0) {
        console.log(user.login42, 'offline');
        this.usersService.updateOnlineStatus(user.login42, false);
        this.websocketsGateway.updateRelations();
      }
    }
  }

  // findAll(): Promise<UserStatus[]> {
  //   return this.statusRepository.find();
  // }

  // findOne(id: string): Promise<UserStatus | void> {
  //   return this.statusRepository.findOne(id);
  // }
}
