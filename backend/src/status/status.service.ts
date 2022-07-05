import { Injectable } from '@nestjs/common';
import { Login42, SocketId, StatusMap, StatusMetrics } from './status.type';

@Injectable()
export class StatusService {
  private sockets = new Map<SocketId, Login42>();
  private statuses = new Map<Login42, StatusMetrics>();

  getStatuses(): StatusMap {
    return this.statuses;
  }

  isNotInGame(login42: string): boolean {
    const userStatusMetrics = this.statuses.get(login42);
    return (userStatusMetrics?.status !== 'IN_GAME') ? true : false;
  }

  getOpponent(userLogin42: Login42) {
    for (const [
      opponentLogin42,
      opponentStatusMetrics,
    ] of this.statuses.entries()) {
      console.log(
        'getOpponent',
        this.statuses,
        opponentLogin42,
        opponentStatusMetrics,
      );

      if (
        opponentStatusMetrics.status === 'IN_QUEUE' &&
        opponentLogin42 !== userLogin42
      ) {
        const userStatusMetrics = this.statuses.get(userLogin42);
        if (userStatusMetrics) {
          opponentStatusMetrics.status = 'IN_GAME';
          userStatusMetrics.status = 'IN_GAME';
          opponentStatusMetrics.opponentLogin42 = userLogin42;
          userStatusMetrics.opponentLogin42 = opponentLogin42;
          return opponentLogin42;
        } else {
          return undefined;
        }
      }
    }
    const userStatusMetrics = this.statuses.get(userLogin42);
    if (userStatusMetrics) {
      userStatusMetrics.status = 'IN_QUEUE';
    }
    return undefined;
  }

  leaveQueue(userLogin42: Login42) {
    const userStatusMetrics = this.statuses.get(userLogin42);
    if (userStatusMetrics) {
      userStatusMetrics.status = 'ONLINE';
    }
  }

  toOnline(userLogin42: Login42): void {
    const currentUserMetrics = this.statuses.get(userLogin42);
    if (currentUserMetrics) {
      this.statuses.set(userLogin42, {
        socketCount: currentUserMetrics.socketCount,
        status: 'ONLINE',
      });
    }
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
