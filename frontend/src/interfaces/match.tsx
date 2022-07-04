import { IUserSlim } from "./IUser";

export interface Match {
  id: string;
  user1: IUserSlim;
  user2: IUserSlim;
  user1Points: number;
  user2Points: number;
  winnerLogin42: string;
}
