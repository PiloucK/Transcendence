export interface IUserSlim {
  login42: string;
  username: string;
  elo: number;
}

export interface IUserPublic extends IUserSlim {
  gamesWon: number;
  gamesLost: number;
}

export interface IUserSelf extends IUserPublic {
  friends: IUserSlim[];
  friendRequestsSent: IUserSlim[];
  friendRequestsReceived: IUserSlim[];
  blockedUsers: IUserSlim[];
  isTwoFactorAuthEnabled: boolean;
}
