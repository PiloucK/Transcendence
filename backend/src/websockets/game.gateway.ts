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


interface ICoordinates {
  x: number;
  y: number;
}

interface IGame {
  player1: string | undefined;
  player2: string | undefined;
  player1Score: number;
  player2Score: number;
  player1ID: string;
  player2ID: string;
  gameStatus: 'WAITING' | 'RUNNING' | 'FINISHED';
} // EXPORTER INTERFACE DANS UN FICHIER

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
  onGameUnmount(
    @MessageBody() userSelf: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.runningGames.forEach((value, key) => {
      if (value.player1 === userSelf || value.player2 === userSelf) {
        this.runningGames.delete(key);
        console.log(key, 'deleted');
        return;
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
     // in order to have player1 < player2
    if (data[0] > data[1]) {
      const tmp = data[1];
      data[1] = data[0];
      data[0] = tmp;
    }

    const [player1, player2, userSelf] = data;
    const gameID = player1 + player2;

    client.join(gameID);

    console.log(userSelf, 'has joined the game of', gameID);

    let currentGame = this.runningGames.get(gameID);

    if (currentGame === undefined) {
      currentGame = {
        player1: undefined,
        player2: undefined,
        player1Score: 0,
        player2Score: 0,
        player1ID: '',
        player2ID: '',
        gameStatus: 'WAITING',
      };
      this.runningGames.set(gameID, currentGame);
    }

    if (userSelf === player1) {
      currentGame.player1 = userSelf;
      currentGame.player1ID = client.id; 
    } else if (userSelf === player2) {
      currentGame.player2 = userSelf;
      currentGame.player2ID = client.id; 
    } else {
      client.emit('game:state', currentGame);
      return;
    }

    if (
      currentGame.gameStatus === 'WAITING' &&
      currentGame.player1 &&
      currentGame.player2
    ) {
      this.server.to(gameID).emit('game:start', gameID);
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

  @SubscribeMessage('game:paddleMove')
  onGamePaddleMove(
    @MessageBody() data: string[],
    @ConnectedSocket() client: Socket,
  ) {
  
    const [paddlePosition, gameID] = data;

    let dest = gameID;

    if (this.runningGames.get(gameID)?.player1ID === client.id)
      dest = this.runningGames.get(gameID)?.player2ID as string;
    else if (this.runningGames.get(gameID)?.player2ID === client.id)
      dest = this.runningGames.get(gameID)?.player1ID as string;

    this.server.to(dest).emit('game:opponentPosition', paddlePosition);

  }




}
