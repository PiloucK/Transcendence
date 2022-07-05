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
import { MatchService } from 'src/match/match.service';
import { MainGateway } from './main.gateway';

interface ICoordinates {
  x: number;
  y: number;
}

interface IBallInfo {
  position: ICoordinates;
  direction: ICoordinates;
}

interface IGame {
  player1: string | undefined;
  player2: string | undefined;
  player1Score: number;
  player2Score: number;
  gameStatus: 'WAITING' | 'READY' | 'DONE';
  ballInfo: IBallInfo;
  ballVelocity: number;
  bounceCount: number;
  intervalID?: ReturnType<typeof setInterval>;
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
    position: { x: 50, y: positionY },
    direction: { x: Math.cos(heading), y: Math.sin(heading) },
  };
}

@WebSocketGateway(3002, { transports: ['websocket'], namespace: 'game' })
export class GameNamespace implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server!: Server;

  private runningGames = new Map<string, IGame>();

  constructor(private readonly matchService: MatchService,
			  private readonly mainGateway: MainGateway) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('game-connection', client.id);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('game-disconnection', client.id);
  }

  @SubscribeMessage('game:unmount')
  onGameUnmount(
    @MessageBody() data: string[],
    @ConnectedSocket() client: Socket,
  ) {
	const [gameID, login42] = data;

	const currentGame = this.runningGames.get(gameID);

	if (currentGame) {
		if (currentGame.player1 === undefined || currentGame.player2 === undefined)
			return ;

		if (login42 !== currentGame.player1 && login42 !== currentGame.player2)
			return ;
		if (currentGame.intervalID) {
			clearInterval(currentGame.intervalID);
		}
		if (currentGame.gameStatus === 'DONE') {
			if (currentGame.player1 && currentGame.player2){
				this.mainGateway.onGameMatchEnd([currentGame.player1, currentGame.player2]);
			}
			this.runningGames.delete(gameID);
		} else {
			const winnerLogin42 = (login42 !== currentGame.player1) ? currentGame.player1 : currentGame.player2;
			this.server.to(gameID).emit('game:winner', winnerLogin42);

			this.matchService.create(
				currentGame.player1,
				currentGame.player2,
				currentGame.player1Score,
				currentGame.player2Score,
				winnerLogin42,
			);
			currentGame.gameStatus = 'DONE';
		}
		client.disconnect();
		console.log('game:unmount');
	}
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
        ballInfo: { position: { x: 50, y: 50 }, direction: { x: 50, y: 50 } },
		ballVelocity: 0.042,
		bounceCount: 0,
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
        currentGame.player2,
        currentGame.player1Score,
        currentGame.player2Score,
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
        .emit(
          'game:init',
          gameID,
          currentGame.player1,
          currentGame.player2,
          0,
          0,
        );

      currentGame.gameStatus = 'READY';
      console.log('sending game start', userSelf);
    }
  }

  @SubscribeMessage('game:new-point')
  onGamePoint(@MessageBody() gameID: string) {
    const currentGame = this.runningGames.get(gameID);

    if (currentGame && currentGame.intervalID === undefined) {
      currentGame.ballInfo = initBall();
      const deltaTime = 1000 / 60;
    //   const ballVelocity = 0.035;

      currentGame.intervalID = setInterval(() => {
        // move ball
        currentGame.ballInfo.position.x =
          currentGame.ballInfo.position.x +
          currentGame.ballInfo.direction.x * currentGame.ballVelocity * deltaTime;
        currentGame.ballInfo.position.y =
          currentGame.ballInfo.position.y +
          currentGame.ballInfo.direction.y * currentGame.ballVelocity * deltaTime;

        // check top / btm collision
        if (currentGame.ballInfo.position.y + 1 >= 100) {
          currentGame.ballInfo.direction.y *= -1;
          currentGame.ballInfo.position.y = 99;
        } else if (currentGame.ballInfo.position.y - 1 <= 0) {
          currentGame.ballInfo.direction.y *= -1;
          currentGame.ballInfo.position.y = 1;
        }

        this.server
          .to(gameID)
          .emit('game:ball-update', currentGame.ballInfo, currentGame.player2);
      }, deltaTime);
    }
  }

  @SubscribeMessage('game:paddleMove')
  onGamePaddleMove(@MessageBody() data: string[]) {
    const [paddlePosition, gameID, player] = data;

    this.server
      .to(gameID)
      .emit('game:newPaddlePosition', paddlePosition, player);
  }

  @SubscribeMessage('game:ballCountered')
  onGameBallCountered(@MessageBody() data: any[]) {
    const [angleRad, gameID, player] = data;
    const currentGame = this.runningGames.get(gameID);

    if (
      currentGame &&
      currentGame.ballInfo &&
      (player === currentGame.player1 || player === currentGame.player2)
    ) {
      currentGame.ballInfo.direction.x = Math.cos(angleRad);
      currentGame.ballInfo.direction.y = Math.sin(angleRad);
      if (player === currentGame.player2) {
        currentGame.ballInfo.direction.x *= -1;
	  }
	  currentGame.bounceCount += 1;
      currentGame.ballVelocity = currentGame.ballVelocity + currentGame.ballVelocity / (currentGame.bounceCount + 10);
    }
  }

  @SubscribeMessage('game:point-lost')
  onGamePointLost(@MessageBody() data: string[]) {
    const [gameID, player] = data;
    const currentGame = this.runningGames.get(gameID);

    if (
      currentGame &&
      (player === currentGame.player1 || player === currentGame.player2) &&
      currentGame.player1 !== undefined &&
      currentGame.player2 !== undefined
    ) {
      if (currentGame.intervalID) {
        clearInterval(currentGame?.intervalID);
        currentGame.intervalID = undefined;
      }

      if (player === currentGame.player1) {
        currentGame.player2Score++;
      } else {
        currentGame.player1Score++;
      }

      this.server.to(gameID).emit('game:update-score', player);

      // setInterval(() => {
      if (currentGame.player1Score < 5 && currentGame.player2Score < 5) {
        this.onGamePoint(gameID);
		return ;
      } else if (currentGame.player1Score >= 5) {
        this.server.to(gameID).emit('game:winner', currentGame.player1);
        this.matchService.create(
          currentGame.player1,
          currentGame.player2,
          currentGame.player1Score,
          currentGame.player2Score,
          currentGame.player1,
        );
      } else {
        this.server.to(gameID).emit('game:winner', currentGame.player2);
        this.matchService.create(
          currentGame.player1,
          currentGame.player2,
          currentGame.player1Score,
          currentGame.player2Score,
          currentGame.player2,
        );
      }
	  currentGame.gameStatus = 'DONE';
      // }, 2000);
    }
  }
}
