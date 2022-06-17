import { IUserSelf } from "./IUser";

export interface ISessionContext {
  userSelf: IUserSelf;
  chatMenu: string;
  setChatMenu?: (menu: string) => void;
  chatDM: string;
  setChatDM?: (dm: string) => void;
  login?: (userSelf: IUserSelf) => void;
  logout?: () => void;
  showSecondFactorLogin: boolean;
  setShowSecondFactorLogin?: (showSecondFactorLogin: boolean) => void;
}
