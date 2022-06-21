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
    @MessageBody() data: string[], 
    @ConnectedSocket() client: Socket,
  ) {

	const [player1, player2, userSelf] = data;

	if (player1 < player2) {
    	client.join(player1 + player2);
		console.log(userSelf, 'has joined the game of', player1, 'and', player2);
		
	}
	else {
    	client.join(player2 + player1);
		console.log(userSelf, 'has joined the game of', player2, 'and', player1);

	}


	
  }

  @SubscribeMessage('game:point')
  onGamePoint(
    @MessageBody() userLogin42: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('point for', userLogin42);
  }

  @SubscribeMessage('game:toto')
  onGameToto(
	@MessageBody() str: string,
	@ConnectedSocket() client: Socket,
  ) {
	console.log(str);
	client.to('42').emit("game:toto", str);
  }
}
