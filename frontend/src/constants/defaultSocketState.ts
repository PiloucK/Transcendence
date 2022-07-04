import { io } from "socket.io-client";

import { ISocketContext } from "../interfaces/ISocketContext";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export const defaultSocketState: ISocketContext = {
  socket: io(
    `http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.WEBSOCKETS_PORT}`,
    { transports: ["websocket"] }
  ),
};