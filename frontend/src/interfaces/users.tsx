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

export type IMessage = {author: string, content: string};
export type DM = {userOne: IUser, userTwo: IUser, messages: Array<IMessage>};
export type Channel = {
	name: string,
	id: number,
	password: string,
	isPrivate: boolean,
	owner: string,
	admin: Array<string>,
	muted: Array<string>,
	banned: Array<string>,
	users: Array<IUserForLeaderboard>,
	messages: Array<IMessage>,
}