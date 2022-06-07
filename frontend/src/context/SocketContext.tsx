import { createContext, useContext, useState } from "react";
import React from "react";
import { Socket } from "socket.io-client";
import io from "socket.io-client";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

interface ISocketContext {
  socket: Socket;
}

const defaultSocketState = {
  socket: io(
    `http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.WEBSOCKETS_PORT}`,
    { transports: ["websocket"] }
  ),
};

const SocketContext = createContext<ISocketContext>(defaultSocketState);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(defaultSocketState.socket);

  socket.on("connect", () => {
    console.log("youhouuuuuuuuuu"); // est-ce que ca marche pour toutes les pages
  });

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
