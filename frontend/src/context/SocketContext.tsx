import { createContext, useContext, useState } from "react";
import React from "react";
import {
  defaultSocketState,
  ISocketContext,
} from "../interfaces/ISocketContext";

const SocketContext = createContext<ISocketContext>(defaultSocketState);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(defaultSocketState.socket);

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export function useSocketContext() {
  return useContext(SocketContext);
}
