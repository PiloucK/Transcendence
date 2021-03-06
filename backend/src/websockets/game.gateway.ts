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
import { SocketId } from 'src/status/status.type';
import { MainGateway } from './main.gateway';

interface ICoordinates {
  x: number;
  y: number;
}

interface IBallInfo {
  position: ICoordinates;
  direction: ICoordinates;
}

interface IUserGameConnection {
  login42: string;
  gameId: string;
}

interface IGame {
  player1: string | undefined;
  player2: string | undefined;
  player1Score: number;
  player2Score: number;
  player1PadPos: number;
  player2PadPos: number;
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
  private sockets = new Map<SocketId, IUserGameConnection>();

  constructor(
    private readonly matchService: MatchService,
    private readonly mainGateway: MainGateway,
  ) {}

  handleConnection(@ConnectedSocket() client: Socket) {
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const userGameConnection = this.sockets.get(client.id);
    if (userGameConnection) {
      this.onGameUnmount(
        [userGameConnection.gameId, userGameConnection.login42],
        client,
      );
    }
  }

  @SubscribeMessage('game:unmount')
  onGameUnmount(
    @MessageBody() data: string[],
    @ConnectedSocket() client: Socket,
  ) {
    const [gameID, login42] = data;

    const currentGame = this.runningGames.get(gameID);

    this.sockets.delete(client.id);

    if (currentGame) {
      if (
        currentGame.player1 === undefined ||
        currentGame.player2 === undefined
      )
        return;

      if (login42 !== currentGame.player1 && login42 !== currentGame.player2)
        return;
      if (currentGame.intervalID) {
        clearInterval(currentGame.intervalID);
		currentGame.intervalID = undefined;
      }
      if (currentGame.gameStatus === 'DONE') {
        if (currentGame.player1 && currentGame.player2) {
          this.mainGateway.onGameMatchEnd([
            currentGame.player1,
            currentGame.player2,
          ]);
        }
        this.runningGames.delete(gameID);
      } else {
        const winnerLogin42 =
          login42 !== currentGame.player1
            ? currentGame.player1
            : currentGame.player2;
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

    this.sockets.set(client.id, { login42: userSelf, gameId: gameID });

    client.join(gameID);


    let currentGame = this.runningGames.get(gameID);

    if (currentGame === undefined) {
      currentGame = {
        player1: undefined,
        player2: undefined,
        player1Score: 0,
        player2Score: 0,
        player1PadPos: 50,
        player2PadPos: 50,
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
    }
  }

  @SubscribeMessage('game:new-point')
  onGamePoint(@MessageBody() gameID: string) {
    const currentGame = this.runningGames.get(gameID);

    while (
      currentGame &&
      currentGame.intervalID === undefined &&
      currentGame.player1Score < 5 &&
      currentGame.player2Score < 5
    ) {
      currentGame.ballInfo = initBall();
      const deltaTime = 1000 / 60;
      currentGame.ballVelocity = 0.042;
      currentGame.bounceCount = 0;

      currentGame.intervalID = setInterval(() => {
        // next pos calculation
        const nextBallInfo: IBallInfo = {
          position: {
            x:
              currentGame.ballInfo.position.x +
              currentGame.ballInfo.direction.x *
                currentGame.ballVelocity *
                deltaTime,
            y:
              currentGame.ballInfo.position.y +
              currentGame.ballInfo.direction.y *
                currentGame.ballVelocity *
                deltaTime,
          },
          direction: currentGame.ballInfo.direction,
        };
        const currentPad: ICoordinates =
          nextBallInfo.direction.x < 0
            ? {
                x: 1,
                y: currentGame.player1PadPos,
              }
            : {
                x: 99,
                y: currentGame.player2PadPos,
              };

        // check top / btm collision
        if (nextBallInfo.position.y + 1 >= 100) {
          nextBallInfo.direction.y *= -1;
          nextBallInfo.position.y = 99;
        } else if (nextBallInfo.position.y - 1 <= 0) {
          nextBallInfo.direction.y *= -1;
          nextBallInfo.position.y = 1;
        }

        if (
          ((currentPad.x + 0.5 >= nextBallInfo.position.x &&
            nextBallInfo.direction.x < 0) ||
            (currentPad.x - 0.5 <= nextBallInfo.position.x &&
              nextBallInfo.direction.x > 0)) &&
          currentPad.y - 5 <= nextBallInfo.position.y &&
          currentPad.y + 5 >= nextBallInfo.position.y
        ) {
          let collidePoint = nextBallInfo.position.y - currentPad.y;
          collidePoint /= 5;

          const angleRad = (collidePoint * Math.PI) / 4;

          nextBallInfo.direction.x = Math.cos(angleRad);
          nextBallInfo.direction.y = Math.sin(angleRad);

          if (nextBallInfo.position.x > 50) {
            nextBallInfo.direction.x *= -1;
          }

          currentGame.bounceCount += 1;
          currentGame.ballVelocity =
            currentGame.ballVelocity +
            currentGame.ballVelocity / (currentGame.bounceCount + 6);
        }

        if (nextBallInfo.position.x <= 0 && nextBallInfo.direction.x < 0) {
          this.onGamePointLost([gameID, currentGame.player1]);
          if (currentGame.intervalID) {
            clearInterval(currentGame?.intervalID);
            currentGame.intervalID = undefined;
          }
        } else if (
          nextBallInfo.position.x >= 100 &&
          nextBallInfo.direction.x > 0
        ) {
          this.onGamePointLost([gameID, currentGame.player2]);
          if (currentGame.intervalID) {
            clearInterval(currentGame?.intervalID);
            currentGame.intervalID = undefined;
          }
        }

        currentGame.ballInfo = nextBallInfo;

        this.server
          .to(gameID)
          .emit('game:ball-update', currentGame.ballInfo, currentGame.player2);
      }, deltaTime);
    }
  }

  @SubscribeMessage('game:paddleMove')
  onGamePaddleMove(@MessageBody() data: any[]) {
    const [paddlePosition, gameID, player] = data;
    const currentGame = this.runningGames.get(gameID);

    if (currentGame && player === currentGame.player1) {
      currentGame.player1PadPos = paddlePosition;
    } else if (currentGame && player === currentGame.player2) {
      currentGame.player2PadPos = paddlePosition;
    }

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
      currentGame.ballVelocity =
        currentGame.ballVelocity +
        currentGame.ballVelocity / (currentGame.bounceCount + 10);
    }
  }

  @SubscribeMessage('game:point-lost')
  onGamePointLost(@MessageBody() data: any[]) {
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

      if (currentGame.player1Score >= 5) {
        this.server.to(gameID).emit('game:winner', currentGame.player1);
        this.matchService.create(
          currentGame.player1,
          currentGame.player2,
          currentGame.player1Score,
          currentGame.player2Score,
          currentGame.player1,
        );
      	currentGame.gameStatus = 'DONE';
      } else if (currentGame.player2Score >= 5) {
        this.server.to(gameID).emit('game:winner', currentGame.player2);
        this.matchService.create(
          currentGame.player1,
          currentGame.player2,
          currentGame.player1Score,
          currentGame.player2Score,
          currentGame.player2,
        );
		currentGame.gameStatus = 'DONE';
      }
    }
  }
}
