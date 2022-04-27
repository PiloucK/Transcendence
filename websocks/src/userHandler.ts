import { Server, Socket } from "socket.io";

export const registerUserHandlers = (io: Server, socket: Socket) => {
  const newUser = () => {
    io.emit("update-leaderboard");
  };
  const eloUpdate = () => {
    io.emit("update-leaderboard");
  };
  const usernameUpdate = () => {
    io.emit("update-leaderboard");
  };
	const relationsUpdate = () => {
		io.emit("update-relations");
	};

  socket.on("user:new", newUser);
  socket.on("user:update-elo", eloUpdate);
  socket.on("user:update-username", usernameUpdate);
	socket.on("user:update-relations", relationsUpdate);
};
