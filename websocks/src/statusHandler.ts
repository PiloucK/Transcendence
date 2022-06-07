import { Server, Socket } from "socket.io";

export const registerStatusHandlers = (io: Server, socket: Socket) => {
  console.log("connect", socket.id);

  socket.on("disconnect", () => {
    console.log("disconnect", socket.id);
  });
};
