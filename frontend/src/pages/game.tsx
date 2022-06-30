import styles from "../styles/Home.module.css";
import { ReactElement, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Ball from "../components/Game/Ball";
import PlayerPaddle from "../components/Game/PlayerPaddle";
import OpponentPaddle from "../components/Game/OpponentPaddle";
import Score from "../components/Game/Score";
import { InGameLayout } from "../layouts/inGameLayout";
import { useRouter } from "next/router";
import { useSessionContext } from "../context/SessionContext";
import { io, Socket } from "socket.io-client";
import getConfig from "next/config";
import { Login42 } from "../interfaces/status.types";
import { IBallStartInfo } from "../interfaces/IBallStartInfo";
import { ICoordinates } from "../interfaces/ICoordinates";

const { publicRuntimeConfig } = getConfig();
const Pong = () => {
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  const gameSocket = useRef<Socket>();
  const gameID = useRef("");
  const player1 = useRef("");
  const player2 = useRef("");
  const invert = useRef(0);

  const sessionContext = useSessionContext();
  const { userLogin42, opponentLogin42 } = useRouter().query;

  const secondMount = useRef(false);
  const [playGame, setPlayGame] = useState(false);
  const ballStartPos = useRef<IBallStartInfo>({
    position: { x: 0, y: 0 },
    direction: { x: 0, y: 0 },
  });

  // function updateScore(winner: string) {
  //   if (winner === "player") setPlayerScore((prevState) => prevState + 1);
  //   if (winner === "opponent") setOpponentScore((prevState) => prevState + 1);
  //   setPlayGame(false);
  // }

  // if (gameSocket.current) {
  //   gameSocket.current.onAny((event, ...args) => {
  //     console.log(event, args);
  //   });
  // }

  //console.log("gamesock", gameSocket.current);

  useEffect(() => {
    console.log("USE EFFECT PONG");

    if (gameSocket.current === undefined) {
      gameSocket.current = io(
        `http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.WEBSOCKETS_PORT}/game`,
        { transports: ["websocket"] }
      );

      gameSocket.current.on(
        "game:init",
        (newGameID: string, p1: Login42, p2: Login42) => {
          gameID.current = newGameID;

          if (p2 === sessionContext.userSelf.login42) {
            player1.current = p2;
            player2.current = p1;
            invert.current = -1;
          } else {
            player1.current = p1;
            player2.current = p2;
            invert.current = 1;
          }
          gameSocket.current?.emit("game:new-point", gameID.current);
        }
      );

      gameSocket.current.on("game:point-start", (data: IBallStartInfo) => {
        data.direction.x *= invert.current;
        ballStartPos.current = data;
        setPlayGame(true);
        // console.log("NEW POINT", data);
      });

      gameSocket.current.on(
        "game:newBallDirection",
        (
          newDirection: ICoordinates,
          newPosition: ICoordinates,
          player: string
        ) => {
          let playerPaddle = document
            .getElementById("player-paddle")
            ?.getBoundingClientRect() as DOMRect;

          let paddleBorderRatio =
            (playerPaddle.right / window.innerWidth) * 100;
          const ballRadiusWidthRatio = window.innerHeight / window.innerWidth;

          if (player !== player1.current) {
            ballStartPos.current.direction.x = newDirection.x * -1;
            ballStartPos.current.direction.y = newDirection.y;
            if (ballStartPos.current.position !== undefined) {
              ballStartPos.current.position.x =
                100 - (paddleBorderRatio + ballRadiusWidthRatio);
              ballStartPos.current.position.y = newPosition.y;
            }
          } else {
            ballStartPos.current.direction = newDirection;
            if (ballStartPos.current.position) {
              ballStartPos.current.position.x =
                paddleBorderRatio + ballRadiusWidthRatio;
              ballStartPos.current.position.y = newPosition.y;
            }
          }

          // console.log('newballdirection', ballStartPos);
        }
      );

      gameSocket.current.on("game:point-lost", (login42: Login42) => {
        if (login42 !== player1.current) {
          setPlayerScore((prevState) => prevState + 1);
        } else {
          setOpponentScore((prevState) => prevState + 1);
        }
        setPlayGame(false);
      });

      // console.log(
      //   "queries: ",
      //   Array.isArray(userLogin42) ? userLogin42[0] : userLogin42,
      //   Array.isArray(opponentLogin42) ? opponentLogin42[0] : opponentLogin42
      // );

      gameSocket.current.emit(
        "game:enter",
        Array.isArray(userLogin42) ? userLogin42[0] : userLogin42,
        Array.isArray(opponentLogin42) ? opponentLogin42[0] : opponentLogin42,
        sessionContext.userSelf.login42
      );
    }
    return () => {
      // edit unmounting logic for spectating and multiple windows on game
      if (secondMount.current !== true) {
        secondMount.current = true;
      } else {
        console.log("unmounting game");
        if (gameSocket.current != undefined) {
          gameSocket.current.emit(
            "game:unmount",
            sessionContext.userSelf.login42
          );
          console.log("closing socket");
        }
      }
    };
  }, []);

  if (
    gameSocket.current === undefined ||
    player1.current === "" ||
    player2.current === ""
  ) {
    return (
      <div className={styles.mainLayout_background}>
        <Score player={playerScore} opponent={opponentScore} />
      </div>
    );
  }
  return (
    <div className={styles.mainLayout_background}>
      <Score player={playerScore} opponent={opponentScore} />
      {playGame === true && (
        <Ball
          ballStartPos={ballStartPos.current}
          gameSocket={gameSocket.current}
          gameID={gameID.current}
          player1={player1.current}
        />
      )}
      <PlayerPaddle
        gameSocket={gameSocket.current}
        gameID={gameID.current}
        player1={player1.current}
      />
      <OpponentPaddle
        gameSocket={gameSocket.current}
        player2={player2.current}
      />
    </div>
  );
};

export default dynamic(() => Promise.resolve(Pong), {
  ssr: false,
});

Pong.getLayout = function getLayout(page: ReactElement) {
  return <InGameLayout>{page}</InGameLayout>;
};
