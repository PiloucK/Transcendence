import { createContext, useContext, useState } from "react";
import React from "react";
import Router from "next/router";

import Cookies from "js-cookie";

import { defaultSessionState, ISessionContext } from "../interfaces/ISessionContext";

import { useSocketContext } from "./SocketContext";

import getConfig from "next/config";
import { IUserSelf } from "../interfaces/IUser";
const { publicRuntimeConfig } = getConfig();

const SessionContext = createContext<ISessionContext>(defaultSessionState);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const socketContext = useSocketContext();
  const [userSelf, setUserSelf] = useState(defaultSessionState.userSelf);
  const [chatMenu, setChatMenu] = useState(defaultSessionState.chatMenu);
  const [chatDM, setChatDM] = useState(defaultSessionState.chatDM);
  const [showSecondFactorLogin, setShowSecondFactorLogin] = useState(
    defaultSessionState.showSecondFactorLogin
  );

  const login = (userSelf: IUserSelf) => {
    socketContext.socket.emit("user:login", userSelf.login42);
    setUserSelf(userSelf);
  };

  const logout = () => {
    socketContext.socket.emit("user:logout", userSelf.login42);
    setUserSelf(defaultSessionState.userSelf);
    Router.push("/");
    Cookies.remove(publicRuntimeConfig.ACCESSTOKEN_COOKIE_NAME, {
      path: publicRuntimeConfig.ACCESSTOKEN_COOKIE_PATH,
    });
  };

  return (
    <SessionContext.Provider
      value={{
        userSelf,
        chatMenu,
        setChatMenu,
        chatDM,
        setChatDM,
        login,
        logout,
        showSecondFactorLogin,
        setShowSecondFactorLogin,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export function useSessionContext() {
  return useContext(SessionContext);
}
