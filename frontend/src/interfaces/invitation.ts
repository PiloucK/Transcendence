import { IUserSelf, IUserSlim } from "./IUser";

export interface Invitation {
  id: string;
  inviter: IUserSelf;
  invited: IUserSelf;
}
