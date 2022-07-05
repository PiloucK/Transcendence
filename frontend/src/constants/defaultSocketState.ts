import { io } from "socket.io-client";

import { ISocketContext } from "../interfaces/ISocketContext";

export const defaultSocketState: ISocketContext = {
  socket: io(
    `http://${process.env.NEXT_PUBLIC__HOST}:${process.env.NEXT_PUBLIC__WEBSOCKETS_PORT}`,
    { transports: ["websocket"] }
  ),
};