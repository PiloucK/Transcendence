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
  gameStatus: 'WAITING' | 'RUNNING' | 'RESET';
} // EXPORTER INTERFACE DANS UN FICHIER

function randomNumberBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function initBall() {
  const positionY = randomNumberBetween(10, 90);
  let heading = randomNumberBetween(0, 2 * Math.PI);

  while (
    Math.abs(Math.cos(heading)) <= 0.2 ||
    Math.abs(Math.cos(heading)) >= 0.9
  ) {
    heading = randomNumberBetween(0, 2 * Math.PI);
  }

  return {
    positionY,
    direction: { x: Math.cos(heading), y: Math.sin(heading) },
  };
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
        gameStatus: 'WAITING',
      };
      this.runningGames.set(gameID, currentGame);
    }

    if (userSelf === player1) {
      currentGame.player1 = userSelf;
    } else if (userSelf === player2) {
      currentGame.player2 = userSelf;
    } else {
      client.emit(
        'game:init',
        gameID,
        currentGame.player1,
        currentGame.player2, //add current score for spectator
      );
      return;
    }

    if (
      currentGame.gameStatus === 'WAITING' &&
      currentGame.player1 &&
      currentGame.player2
    ) {
      this.server
        .to(gameID)
        .emit('game:init', gameID, currentGame.player1, currentGame.player2);

      currentGame.gameStatus = 'RUNNING';
      console.log('sending game start', userSelf);

    }
  }


  @SubscribeMessage('game:new-point')
  onGamePoint(
    @MessageBody() gameID: string,
  ) {
		this.server
	  	.to(gameID)
		.emit('game:point-start', initBall());
  }

  @SubscribeMessage('game:ball')
  onGameBall(@MessageBody() ball: string, @ConnectedSocket() client: Socket) {
    console.log('ball details:', ball);
  }

  @SubscribeMessage('game:paddleMove')
  onGamePaddleMove(@MessageBody() data: string[]) {
    const [paddlePosition, gameID, player] = data;

    this.server
      .to(gameID)
      .emit('game:newPaddlePosition', paddlePosition, player);
  }

  @SubscribeMessage('game:ballCountered')
  onGameBallCountered(
    @MessageBody() data: string[],
    @ConnectedSocket() client: Socket,
  ) {
	const [angleRad, gameID, player] = data;

	const directionX = Math.cos(parseFloat(angleRad));
	const directionY = Math.sin(parseFloat(angleRad));

    this.server
      .to(gameID)
      .emit('game:newBallDirection', {x : directionX, y : directionY}, player);
  }

  @SubscribeMessage('game:point-lost')
  onGamePointLost(@MessageBody() data: string[]) {
    const [gameID, player] = data;

    this.server.to(gameID).emit('game:point-lost', player);

    setTimeout(() => {
      this.server.to(gameID).emit('game:point-start', initBall());
    }, 2000);
  }


}
