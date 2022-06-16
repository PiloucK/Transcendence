import { IUserSelf } from "../interfaces/IUser";

export const defaultUserSelf: IUserSelf = {
  login42: "Norminet",
  username: "Wonderful Guest",
  elo: 0,
  gamesWon: 0,
  gamesLost: 0,
  friends: [],
  friendRequestsSent: [],
  friendRequestsReceived: [],
  blockedUsers: [],
  isTwoFactorAuthEnabled: false,
};
