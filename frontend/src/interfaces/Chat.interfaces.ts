import { IUserSelf, IUserSlim } from "./IUser";

export type Message = { author: string; content: string };
export type Invitation = { author: string; channelId: string };
export type PrivateConv = {
  userOne: IUserSlim;
  userTwo: IUserSlim;
  messages: Array<Message | Invitation>;
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
  users: Array<IUserSlim>;
  messages: Array<Message>;
  image: string;
};
export type ChannelCreation = {
  name: string;
  password: string;
  isPrivate: boolean;
};
