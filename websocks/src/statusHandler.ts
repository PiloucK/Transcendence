import { Server, Socket } from "socket.io";
import { UserStatus } from ".";

export const registerStatusHandlers = (
  io: Server,
  socket: Socket,
  userStatus: UserStatus[]
) => {
  console.log("connect", socket.id);

  socket.on("disconnect", () => {
    console.log("disconnect", socket.id);
  });
};
