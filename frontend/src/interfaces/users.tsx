export interface IUserForLeaderboard {
  login42: string; // peut-etre a retirer (seul identifiant unique qu'on passe au front)
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
  token42: string; // token 42 (changer le nom)
  //photo?
  twoFa: boolean;
}

export interface IUserCredentials {
  login42: string;
}

export type IMessage = { author: string; content: string };
export type Invitation = { author: string; channelId: string };
export type DM = {
  userOne: IUser;
  userTwo: IUser;
  messages: Array<IMessage | Invitation>;
};
export type restriction = { login: string; until: number }; // login, end of the restriction in ms.
export type Channel = {
  name: string;
  id: string;
  password: string;
  isPrivate: boolean;
  owner: string;
  admin: Array<string>;
  muted: Array<restriction>;
  banned: Array<restriction>;
  users: Array<IUserForLeaderboard>;
  messages: Array<IMessage>;
};

export type ChannelCreation = {
  name: string;
  password: string;
  isPrivate: boolean;
};
