export type EmittedLiveStatus = "ONLINE" | "IN_GAME" | "IN_QUEUE" | "OFFLINE";

export interface StatusMetrics {
  socketCount: number;
  status: EmittedLiveStatus;
  opponentLogin42?: Login42;
}

export type Login42 = string;

export type StatusMap = Map<Login42, StatusMetrics>;
