import { io, Socket } from "socket.io-client";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export interface ISocketContext {
  socket: Socket;
}

export const defaultSocketState = {
  socket: io(
    `http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.WEBSOCKETS_PORT}`,
    { transports: ["websocket"] }
  ),
};