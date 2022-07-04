import { Injectable } from '@nestjs/common';
import { Login42, SocketId, StatusMap, StatusMetrics } from './status.type';

@Injectable()
export class StatusService {
  private sockets = new Map<SocketId, Login42>();
  private statuses = new Map<Login42, StatusMetrics>();

  getStatuses(): StatusMap {
    return this.statuses;
  }

  add(socketId: SocketId, userLogin42: Login42): 'EMIT' | 'QUIET' {
    if (this.sockets.has(socketId)) {
      return 'QUIET';
    }

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

  remove(socketId: SocketId): Login42 | undefined {
    const currentUserLogin42 = this.sockets.get(socketId);
    if (!currentUserLogin42) {
      return undefined;
    }

    this.sockets.delete(socketId);

    const currentUserMetrics = this.statuses.get(currentUserLogin42);
    if (!currentUserMetrics) {
      return currentUserLogin42;
    }

    --currentUserMetrics.socketCount;
    if (currentUserMetrics.socketCount === 0) {
      this.statuses.delete(currentUserLogin42);

      return currentUserLogin42;
    } else {
      return undefined;
    }
  }
}
