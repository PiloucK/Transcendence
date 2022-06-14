import { createContext, useContext, useState } from "react";
import React from "react";
import Router from "next/router";

import Cookies from "js-cookie";

import { defaultLoginState, ILoginContext } from "../interfaces/ILoginContext";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const LoginContext = createContext<ILoginContext>(defaultLoginState);

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const [userLogin, setUserLogin] = useState(defaultLoginState.userLogin);
  const [chatMenu, setChatMenu] = useState(defaultLoginState.chatMenu);
  const [chatDM, setChatDM] = useState(defaultLoginState.chatDM);
  const [secondFactorLogin, setSecondFactorLogin] = useState(
    defaultLoginState.secondFactorLogin
  );

  const login = (userLogin: string) => {
    setUserLogin(userLogin);
  };

  const logout = () => {
    setUserLogin(null);
    Router.push("/");
    Cookies.remove(publicRuntimeConfig.ACCESSTOKEN_COOKIE_NAME, {
      path: publicRuntimeConfig.ACCESSTOKEN_COOKIE_PATH,
    });
  };

  return (
    <LoginContext.Provider
      value={{
        userLogin,
        chatMenu,
        setChatMenu,
        chatDM,
        setChatDM,
        login,
        logout,
        secondFactorLogin,
        setSecondFactorLogin,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export function useLoginContext() {
  return useContext(LoginContext);
}
