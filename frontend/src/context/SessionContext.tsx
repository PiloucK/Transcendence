import { createContext, useContext, useState } from "react";
import React from "react";
import Router from "next/router";
import Cookies from "js-cookie";
import { useSocketContext } from "./SocketContext";
import { ISessionContext } from "../interfaces/ISessionContext";
import { defaultSessionState } from "../constants/defaultSessionState";
import { IUserSelf } from "../interfaces/IUser";
import authService from "../services/auth";

const SessionContext = createContext<ISessionContext>(defaultSessionState);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const socketContext = useSocketContext();
  const [userSelf, setUserSelf] = useState(defaultSessionState.userSelf);
  const [chatMenu, setChatMenu] = useState(defaultSessionState.chatMenu);
  const [chatDM, setChatDM] = useState(defaultSessionState.chatDM);

  const login = (userSelf: IUserSelf) => {
    socketContext.socket.emit("user:login", userSelf.login42);
    setUserSelf(userSelf);
  };

  const logout = () => {
    socketContext.socket.emit("user:logout", userSelf.login42);
    setUserSelf(defaultSessionState.userSelf);
    Router.push("/");
    if (
      process.env.NEXT_PUBLIC__ACCESSTOKEN_COOKIE_NAME &&
      process.env.NEXT_PUBLIC__ACCESSTOKEN_COOKIE_PATH
    ) {
      Cookies.remove(process.env.NEXT_PUBLIC__ACCESSTOKEN_COOKIE_NAME, {
        path: process.env.NEXT_PUBLIC__ACCESSTOKEN_COOKIE_PATH,
      });
    }
  };

  const updateUserSelf = async () => {
    const user = await authService.getLoggedInUser().catch(() => {
      return;
    });
    setUserSelf(user);
  };

  return (
    <SessionContext.Provider
      value={{
        userSelf,
        updateUserSelf,
        chatMenu,
        setChatMenu,
        chatDM,
        setChatDM,
        login,
        logout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export function useSessionContext() {
  return useContext(SessionContext);
}
