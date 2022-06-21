import { forwardRef, Inject } from '@nestjs/common';
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
import { StatusService } from 'src/status/status.service';

@WebSocketGateway(3002, { transports: ['websocket'], namespace: 'game' })
export class GameNamespace
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  protected server!: Server;

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('game-connection', client.id);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('game-disconnection', client.id);
  }

  @SubscribeMessage('game:enter')
  onGameEnter(
    @MessageBody() userLogin42: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(userLogin42);
  }

  @SubscribeMessage('game:point')
  onGamePoint(
    @MessageBody() userLogin42: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('point for', userLogin42);
  }
}
