import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3002, { transports: ['websocket'], namespace: 'game' })
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('game connected', client.id);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('game disconnected', client.id);
  }

  @SubscribeMessage('game:new')
  onUserLogin() {
    console.log('game:new');
  }
}
