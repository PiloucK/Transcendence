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
import { EmittedLiveStatus } from 'src/status/status.type';

@WebSocketGateway(3002, { transports: ['websocket'] })
export class MainGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly statusService: StatusService) {}
  @WebSocketServer()
  server!: Server;

  handleConnection(@ConnectedSocket() client: Socket) {
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const userLogin42 = this.statusService.remove(client.id);
    if (userLogin42) {
      this.updateStatus(userLogin42, 'OFFLINE');
    }
  }

  updateStatus(
    userLogin42: string,
    status: EmittedLiveStatus,
    opponentLogin42: string | undefined = undefined,
  ) {
    this.server.emit(
      'user:update-status',
      userLogin42,
      status,
      opponentLogin42,
    );
  }

  @SubscribeMessage('user:find-match')
  onUserFindMatch(@MessageBody() userLogin42: string) {
    const opponentLogin42 = this.statusService.getOpponent(userLogin42);
    if (!opponentLogin42) {
      this.updateStatus(userLogin42, 'IN_QUEUE');
    } else {
      this.updateStatus(userLogin42, 'IN_GAME', opponentLogin42);
      this.updateStatus(opponentLogin42, 'IN_GAME', userLogin42);
    }
  }

  @SubscribeMessage('game:match-end')
  onGameMatchEnd(@MessageBody() data: string[]) {
    const [player1, player2] = data;

    if (player1) {
      this.statusService.toOnline(player1);
      this.updateStatus(player1, 'ONLINE');
    }
    if (player2) {
      this.statusService.toOnline(player2);
      this.updateStatus(player2, 'ONLINE');
    }
  }

  @SubscribeMessage('user:accept-match')
  onUserAcceptMatch(
    @MessageBody() data: string[],
    @ConnectedSocket() client: Socket,
  ) {
    const [invitedLogin, inviterLogin] = data;

    if (
      this.statusService.isReadyToPlay(invitedLogin) === true &&
      this.statusService.isReadyToPlay(inviterLogin) === true
    ) {
      this.updateStatus(invitedLogin, 'IN_GAME', inviterLogin);
      this.updateStatus(inviterLogin, 'IN_GAME', invitedLogin);
    }
  }

  @SubscribeMessage('user:login')
  onUserLogin(
    @MessageBody() userLogin42: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (this.statusService.add(client.id, userLogin42) === 'EMIT') {
      this.updateStatus(userLogin42, 'ONLINE');
    }
  }

  @SubscribeMessage('user:leave-queue')
  onLeaveQueue(@MessageBody() userLogin42: string) {
    this.statusService.leaveQueue(userLogin42);
    this.updateStatus(userLogin42, 'ONLINE');
  }

  @SubscribeMessage('user:logout')
  onUserLogout(
    @MessageBody() userLogin42: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (this.statusService.remove(client.id) === 'EMIT') {
      this.updateStatus(userLogin42, 'OFFLINE');
    }
  }

  @SubscribeMessage('user:new')
  onNewUser() {
    this.server.sockets.emit('update-leaderboard');
  }

  @SubscribeMessage('user:invitation-sent')
  onInvitationSent() {
    this.server.sockets.emit('fetch-invitations');
  }

  @SubscribeMessage('user:update-elo')
  onEloUpdate() {
    this.server.sockets.emit('update-leaderboard');
  }

  @SubscribeMessage('user:update-username')
  onUsernameUpdate() {
    this.server.sockets.emit('update-leaderboard');
  }

  @SubscribeMessage('user:update-image')
  onImageUpdate() {
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
