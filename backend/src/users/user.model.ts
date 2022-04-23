export interface IUserForLeaderboard {
  username: string; // username qu'on peut changer (unique?)
  //photo?
  elo: number;
}

export interface IUserPublicInfos extends IUserForLeaderboard {
  //login42?
  gamesWon: number;
  gamesLost: number;
}

export interface IUser extends IUserPublicInfos {
  id: string; // uuid
  login42: string; // peut-etre a retirer (seul identifiant unique qu'on passe au front)
  token42: string; // token 42 (changer le nom)
  //photo?
  twoFa: boolean;
}