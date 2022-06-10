import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3002, { transports: ['websocket'] })
export class WebsocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('connection', client.id);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('disconnection', client.id);
  }

  @SubscribeMessage('user:new')
  onNewUser() {
    this.server.sockets.emit('update-leaderboard');
  }
}
