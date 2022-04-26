// from https://socket.io/docs/v4/server-initialization/#standalone
// and https://socket.io/docs/v4/server-application-structure/#each-file-registers-its-own-event-handlers

import { Server, Socket } from "socket.io";
import { registerUserHandlers } from "./userHandler";

const io = new Server(3002, {});

const onConnection = (socket: Socket) => {
  registerUserHandlers(io, socket);
};
io.on("connection", onConnection);
