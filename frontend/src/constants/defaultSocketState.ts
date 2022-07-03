import { io } from "socket.io-client";

import { ISocketContext } from "../interfaces/ISocketContext";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export const defaultSocketState: ISocketContext = {
  socket: io(
    `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_WEBSOCKETS_PORT}`,
    { transports: ["websocket"] }
  ),
};