import { defaultUserSelf } from "../constants/defaultIUser";
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

export const defaultSessionState: ISessionContext = {
  userSelf: defaultUserSelf,
  chatMenu: "direct_message",
  chatDM: "new_message",
  showSecondFactorLogin: false,
};
