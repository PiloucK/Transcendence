import { ISessionContext } from "../interfaces/ISessionContext";
import { defaultUserSelf } from "./defaultUserSelf";

export const defaultSessionState: ISessionContext = {
  userSelf: defaultUserSelf,
  chatMenu: "direct_message",
  chatDM: "new_message",
  showSecondFactorLogin: false,
};
