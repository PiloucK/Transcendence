import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(3002, { transports: ['websocket'] })
export class WebsocketsGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('user:new')
  onNewUser() {
    this.server.sockets.emit('update-leaderboard');
  }
}
