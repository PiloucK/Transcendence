export interface IUserForLeaderboard {
  login42: string; // peut-etre a retirer (seul identifiant unique qu'on passe au front)
  username: string; // username qu'on peut changer (unique?)
  photo42: string;
  image: string;
  //photo?
  elo: number;
  online: boolean;
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
  photo42: string;
}

export type Message = { author: string; content: string };
export type Invitation = { author: string; channelId: string };
export type PrivateConv = {
  userOne: IUser;
  userTwo: IUser;
  messages: Array<Message | Invitation>;
};
export type restriction = { login: string; until: number }; // login, end of the restriction in ms.
export type Channel = {
  name: string;
  id: string;
  image: string;
  password: string;
  isPrivate: boolean;
  owner: string;
  admin: Array<string>;
  muted: Array<restriction>;
  banned: Array<restriction>;
  users: Array<IUserForLeaderboard>;
  messages: Array<Message>;
};

export type ChannelCreation = {
  name: string;
  password: string;
  isPrivate: boolean;
};
