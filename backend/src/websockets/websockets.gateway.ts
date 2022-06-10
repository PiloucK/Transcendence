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

  @SubscribeMessage('user:logged')
  onLoggedUser(
    @MessageBody() userLogin42: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('login:', userLogin42, client.id);
  }

  @SubscribeMessage('user:new')
  onNewUser() {
    this.server.sockets.emit('update-leaderboard');
  }

  @SubscribeMessage('user:update-elo')
  onEloUpdate() {
    this.server.sockets.emit('update-leaderboard');
  }

  @SubscribeMessage('user:update-username')
  onUsernameUpdate() {
    this.server.sockets.emit('update-leaderboard');
  }

  @SubscribeMessage('user:update-relations')
  onRelationsUpdate() {
    this.server.sockets.emit('update-relations');
  }

  @SubscribeMessage('user:update-direct-messages')
  onUserDMUpdate() {
    this.server.sockets.emit('update-direct-messages');
  }

  @SubscribeMessage('user:update-public-channels')
  onUserPublicChannelUpdate() {
    this.server.sockets.emit('update-public-channels');
  }

  @SubscribeMessage('user:update-joined-channels')
  onUserJoinedChannelUpdate() {
    this.server.sockets.emit('update-channels-list');
  }

  @SubscribeMessage('user:update-channel-content')
  onChannelContentUpdate() {
    this.server.sockets.emit('update-channel-content');
  }
}
