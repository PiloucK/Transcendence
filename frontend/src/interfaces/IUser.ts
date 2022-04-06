import IUserCredentials from "./IUserCredentials";
import IUserStats from "./IUserStats"

export default interface IUser {
    credentials: IUserCredentials;
    stats: IUserStats;
  }
  