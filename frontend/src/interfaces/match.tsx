import { IUserSelf, IUserSlim } from "./IUser";

export interface Match {
  id: string;
  user1: IUserSelf;
  user2: IUserSelf;
  user1Points: number;
  user2Points: number;
}
