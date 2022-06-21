import { Injectable } from '@nestjs/common';
import { StoredLiveStatus } from './status.type';

interface StatusMetrics {
  socketCount: number;
  status: StoredLiveStatus;
}

type Login42 = string;
type SocketId = string;

@Injectable()
export class StatusService {
  private sockets = new Map<SocketId, Login42>();
  private statuses = new Map<Login42, StatusMetrics>();

  getStatuses(): Map<Login42, StatusMetrics> {
    return this.statuses;
  }

  add(socketId: SocketId, userLogin42: Login42): 'EMIT' | 'QUIET' {
    this.sockets.set(socketId, userLogin42);

    const currentUserMetrics = this.statuses.get(userLogin42);
    if (!currentUserMetrics) {
      this.statuses.set(userLogin42, {
        socketCount: 1,
        status: 'ONLINE',
      });
      console.log('online!');

      return 'EMIT';
    } else {
      ++currentUserMetrics.socketCount;
      console.log('online dup');
      return 'QUIET';
    }
  }

  remove(socketId: SocketId): Login42 | undefined {
    const currentUserLogin42 = this.sockets.get(socketId);
    if (!currentUserLogin42) {
      console.log('socket not found');
      return undefined;
    }

    this.sockets.delete(socketId);

    const currentUserMetrics = this.statuses.get(currentUserLogin42);
    if (!currentUserMetrics) {
      console.log('offline!');
      return currentUserLogin42;
    }

    --currentUserMetrics.socketCount;
    if (currentUserMetrics.socketCount === 0) {
      this.statuses.delete(currentUserLogin42);
      console.log('offline!');

      return currentUserLogin42;
    } else {
      console.log('still online');
      return undefined;
    }
  }
}
