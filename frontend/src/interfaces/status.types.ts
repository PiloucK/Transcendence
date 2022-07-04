export type EmittedLiveStatus = "ONLINE" | "IN_GAME" | "IN_QUEUE" | "OFFLINE";

export interface StatusMetrics {
  socketCount: number;
  status: EmittedLiveStatus;
}

export type Login42 = string;

export type StatusMap = Map<Login42, StatusMetrics>;
