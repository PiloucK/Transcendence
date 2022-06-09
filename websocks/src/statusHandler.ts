import { Server, Socket } from "socket.io";
import statusService from "./statusService";

export const registerStatusHandlers = (io: Server, socket: Socket) => {
  console.log("connect", socket.id);
  socket.on("user:logged", (login42: string) => {
    console.log("logggg", login42);
  });

  socket.on("disconnect", () => {
    statusService.remove(socket.id); // error handling
    console.log("disconnect", socket.id);
  });
};
