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

interface IGame {
  player1: string | undefined;
  player2: string | undefined;
  player1Score: number;
  player2Score: number;
  gameStatus: 'WAITING' | 'RUNNING' | 'FINISHED';
}

@WebSocketGateway(3002, { transports: ['websocket'], namespace: 'game' })
export class GameNamespace implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server!: Server;

  private runningGames = new Map<string, IGame>();

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('game-connection', client.id);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    
    console.log('game-disconnection', client.id);

  }

  @SubscribeMessage('game:unmount')
  onGameUnmount (
    @MessageBody() userSelf: string,
    @ConnectedSocket() client: Socket,
  )
  {

    this.runningGames.forEach((value, key) => {
      if (value.player1 === userSelf || value.player2 === userSelf) {
        this.runningGames.delete(key);
        console.log(key, 'deleted');
        
        return ; 
      }
    });



    client.disconnect();
    console.log('game:unmount');
    
  }

  @SubscribeMessage('game:enter')
  onGameEnter(
    @MessageBody() data: string[],
    @ConnectedSocket() client: Socket,
  ) {
    console.log('before:', data);

    // in order to have player1 < player2
    if (data[0] > data[1]) {
      const tmp = data[1];
      data[1] = data[0];
      data[0] = tmp;
    }

    console.log('after:', data);
    
    const [player1, player2, userSelf] = data;
    const gameName = player1 + player2;

    client.join(gameName);
    console.log(userSelf, 'has joined the game of', gameName);

    let currentGame = this.runningGames.get(gameName);

    if (currentGame === undefined) {
      currentGame = {
        player1: undefined,
        player2: undefined,
        player1Score: 0,
        player2Score: 0,
        gameStatus: 'WAITING',
      };
      this.runningGames.set(gameName, currentGame);
    }

    if (userSelf === player1) {
      currentGame.player1 = userSelf;
    } else if (userSelf === player2) {
      currentGame.player2 = userSelf;
    } else {
      client.emit('game:state', currentGame);
      return;
    }

    if (
      currentGame.gameStatus === 'WAITING' &&
      currentGame.player1 &&
      currentGame.player2
    ) {
      this.server.to(gameName).emit('game:start');
      currentGame.gameStatus = 'RUNNING';
      console.log('sending game start', userSelf);

      // game start logic - emit ball trajectory
    }
  }

  @SubscribeMessage('game:point')
  onGamePoint(
    @MessageBody() userLogin42: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('point for', userLogin42);
  }

  @SubscribeMessage('game:ball')
  onGameBall(@MessageBody() ball: string, @ConnectedSocket() client: Socket) {
    console.log('ball details:', ball);
  }

  @SubscribeMessage('game:paddles')
  onGamePaddles(
    @MessageBody() data: string[], //data[0] = user, data[1] = paddle position
    @ConnectedSocket() client: Socket,
  ) {
    console.log('data');
    
  }

  //   @SubscribeMessage('game:toto')
  //   onGameToto(
  // 	@MessageBody() str: string,
  // 	@ConnectedSocket() client: Socket,
  //   ) {
  // 	console.log(str);
  // 	client.to('42').emit("game:toto", str);
  //   }
}
