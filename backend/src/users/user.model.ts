export interface IUserForLeaderboard {
  login42: string; // peut-etre a retirer (seul identifiant unique qu'on passe au front)
  username: string; // username qu'on peut changer (unique?)
  //photo?
  elo: number;
}

export interface IUserPublicInfos extends IUserForLeaderboard {
  //photo?
  gamesWon: number;
  gamesLost: number;
}

export interface IUser extends IUserPublicInfos {
  id: string; // uuid
  token42: string; // token 42 (changer le nom)
  friends: Array<string>;
  friendRequestsSent: Array<string>;
  friendRequestsReceived: Array<string>;
  blockedUsers: Array<string>;
  twoFa: boolean;
}

export type Friends = Array<string>;
export type FriendRequestsSent = Array<string>;
export type FriendRequestsReceived = Array<string>;
export type BlockedUsers = Array<string>;