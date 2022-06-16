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
    const currentUserMetrics = this.statuses.get(userLogin42);

    if (!currentUserMetrics) {
      this.statuses.set(userLogin42, {
        socketCount: 1,
        status: 'ONLINE',
      });
      return 'EMIT';
    } else {
      ++currentUserMetrics.socketCount;
      return 'QUIET';
    }
  }

  remove(socketId: string): 'EMIT' | 'QUIET' {
    const currentUserLogin42 = this.sockets.get(socketId);

    if (!currentUserLogin42) {
      return 'QUIET';
    }

    const currentUserMetrics = this.statuses.get(currentUserLogin42);

    if (!currentUserMetrics) {
      this.sockets.delete(socketId);
      return 'EMIT';
    }

    --currentUserMetrics.socketCount;

    if (currentUserMetrics.socketCount === 0) {
      this.statuses.delete(currentUserLogin42);
      this.sockets.delete(socketId);
      return 'EMIT';
    } else {
      this.sockets.delete(socketId);
      return 'QUIET';
    }
  }
}
