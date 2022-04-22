import { IUserCredentials } from "./IUserCredentials";
import { IUserStats } from "./IUserStats";

export interface IUser {
  credentials: IUserCredentials;
  stats: IUserStats;
}

// Temporary matching the definition of the backend model:

// export interface IUser {
// 	id: string;
// 	login: string;
// 	pass: string;
// 	status: UserStatus;
// 	level: number;
// 	ranking: number;
// 	gamesWon: number;
// 	gamesLost: number;
// 	twoFa: number;
// }

// export enum UserStatus {
//     IS_GUEST="IS_GUEST",
//     IS_42API ="IS_42API",
// }
