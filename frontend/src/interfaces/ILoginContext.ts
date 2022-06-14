export interface ILoginContext {
  userLogin: string | null;
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
  userLogin: null,
  chatMenu: "direct_message",
  chatDM: "new_message",
  showSecondFactorLogin: false,
};
