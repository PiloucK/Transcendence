// from https://socket.io/docs/v4/server-initialization/#standalone

import { Server } from "socket.io";

const io = new Server(3002, {});

io.on("connection", (socket) => {
  socket.on("newUser", () => {
    io.emit("leaderboardUpdate");
  });
  socket.on("newRank", () => {
    io.emit("leaderboardUpdate");
  });
  socket.on("usernameChange", () => {
    io.emit("leaderboardUpdate");
  });
});
