export class User {
  id: string; // uuid
  login42: string; // peut-etre a retirer (seul identifiant unique qu'on passe au front)
  token42: string; // token 42 (changer le nom)
  username: string; // username qu'on peut changer (unique?)
  //photo?
  elo: number;
  gamesWon: number;
  gamesLost: number;
  twoFa: boolean;
}

export class UserPublicInfos {
  //login42?
  username: string;
  //photo?
  elo: number;
  gamesWon: number;
  gamesLost: number;
}

export class UserForLeaderboard {
  username: string;
  //photo?
  elo: number;
}
