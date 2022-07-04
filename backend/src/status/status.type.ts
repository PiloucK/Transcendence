export type StoredLiveStatus = 'ONLINE' | 'IN_GAME' | 'IN_QUEUE';

export type EmittedLiveStatus = StoredLiveStatus | 'OFFLINE';

export interface StatusMetrics {
  socketCount: number;
  status: StoredLiveStatus;
  opponentLogin42?: Login42;
}

export type Login42 = string;
export type SocketId = string;

export type StatusMap = Map<Login42, StatusMetrics>;
