import { IUserSelf } from "../interfaces/IUser";

export const defaultUserSelf: IUserSelf = {
  login42: "Norminet",
  username: "(empty username)",
  elo: 0,
  photo42: "https://cdn.intra.42.fr/users/chdespon.jpg",
  image: "",
  gamesWon: 0,
  gamesLost: 0,
  friends: [],
  friendRequestsSent: [],
  friendRequestsReceived: [],
  blockedUsers: [],
  isTwoFactorAuthEnabled: false,
};
