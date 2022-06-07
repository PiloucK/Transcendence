// from https://socket.io/docs/v4/server-initialization/#standalone
// and https://socket.io/docs/v4/server-application-structure/#each-file-registers-its-own-event-handlers

import { Server, Socket } from "socket.io";
import { registerStatusHandlers } from "./statusHandler";
import { registerUserHandlers } from "./userHandler";

const port = Number(process.env.WEBSOCKETS_PORT);
const io = new Server(port, {});

const onConnection = (socket: Socket) => {
  registerUserHandlers(io, socket);
  registerStatusHandlers(io, socket);
};
io.on("connection", onConnection);
