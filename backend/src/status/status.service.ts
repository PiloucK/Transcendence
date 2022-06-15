import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

interface StatusMetrics {
  socketCount: number;
  status: 'ONLINE' | 'IN_GAME' | 'IN_QUEUE';
}

type Login42 = string;
type SocketId = string;

@Injectable()
export class StatusService {
  private sockets = new Map<SocketId, Login42>();
  private statuses = new Map<Login42, StatusMetrics>();

  constructor(private readonly usersService: UsersService) {}

  add(socketId: SocketId, userLogin42: Login42): 'EMIT' | 'QUIET' {
    this.sockets.set(socketId, userLogin42);
    const currentUser = this.statuses.get(userLogin42);
    if (!currentUser) {
      this.statuses.set(userLogin42, {
        socketCount: 1,
        status: 'ONLINE',
      });
      return 'EMIT';
    } else {
      ++currentUser.socketCount;
      return 'QUIET';
    }
  }

  remove(socketId: string): 'EMIT' | 'QUIET' {
    const currentSocket = this.sockets.get(socketId);
    if (currentSocket) {
      const currentUser = this.statuses.get(currentSocket);
      if (currentUser) {
        --currentUser.socketCount;
        if (currentUser.socketCount === 0) {
          return 'EMIT';
        } else {
          return 'QUIET';
        }
      }
    }
  }
}
