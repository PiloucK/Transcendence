import { Server, Socket } from "socket.io";

export const registerStatusHandlers = (io: Server, socket: Socket) => {
  console.log("connect", socket.id);
  socket.on("user:logged", (login42: string) => {
    console.log("logggg", login42);
  });

  socket.on("disconnect", () => {
    console.log("disconnect", socket.id);
  });
};
