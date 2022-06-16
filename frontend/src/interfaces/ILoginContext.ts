import { defaultUserSelf } from "../constants/defaultIUser";
import { IUserSelf } from "./IUser";

export interface ILoginContext {
  userSelf: IUserSelf;
  chatMenu: string;
  setChatMenu?: (menu: string) => void;
  chatDM: string;
  setChatDM?: (dm: string) => void;
  login?: (userLogin: string) => void;
  logout?: () => void;
  showSecondFactorLogin: boolean;
  setShowSecondFactorLogin?: (showSecondFactorLogin: boolean) => void;
}

export const defaultLoginState: ILoginContext = {
  userSelf: defaultUserSelf,
  chatMenu: "direct_message",
  chatDM: "new_message",
  showSecondFactorLogin: false,
};
