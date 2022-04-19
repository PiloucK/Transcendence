// import { Server } from "socket.io";

// const io = new Server(3000);

// io.on("connection", (socket) => {
//   // envoi d'un message au client
//   socket.emit("bonjour du serveur", 1, "2", { 3: Buffer.from([4]) });

//   // réception d'un message envoyé par le client
//   socket.on("bonjour du client", (...args) => {
//     // ...
//   });
// });
import { Server } from 'socket.io'

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io
  }
  res.end()
}

export default SocketHandler
