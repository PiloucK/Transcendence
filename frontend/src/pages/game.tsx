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
import { ICoordinates } from "../interfaces/ICoordinates";
import { IBallInfo } from "../interfaces/IBallInfo";

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
  const [ballInfo, setBallInfo] = useState<IBallInfo>({
    position: { x: 50, y: 50 },
    direction: { x: 0, y: 0 },
  });

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

      gameSocket.current.on("game:point-start", (data: IBallInfo) => {
        data.direction.x *= invert.current;
        setBallInfo(data); // utilisation d'un useState pour tester l'envoie des infos depuis game, sinon revenir sur un useRef
        setPlayGame(true);
        console.log("NEW POINT", data);
      });

    //   gameSocket.current.on(
    //     "game:newBallInfo",
    //     (newBallInfo: IBallInfo, player: string) => {
    //       let playerPaddle = document
    //         .getElementById("player-paddle")
    //         ?.getBoundingClientRect() as DOMRect;

    //       let paddleBorderRatio =
    //         (playerPaddle.right / window.innerWidth) * 100;

    //       const ballRadiusWidthRatio = window.innerHeight / window.innerWidth;
    //       if (player === player2.current) {
    //         newBallInfo.direction.x *= -1;

    //         newBallInfo.position.x =
    //           100 - (paddleBorderRatio + ballRadiusWidthRatio);
    //       } else
    //         newBallInfo.position.x = paddleBorderRatio + ballRadiusWidthRatio;
    //       setBallInfo(newBallInfo);
    //     }
    //   );

      gameSocket.current.emit(
        "game:enter",
        Array.isArray(userLogin42) ? userLogin42[0] : userLogin42,
        Array.isArray(opponentLogin42) ? opponentLogin42[0] : opponentLogin42,
        sessionContext.userSelf.login42
      );

      gameSocket.current.on("game:point-lost", (login42: Login42) => {
        if (login42 !== player1.current) {
          setPlayerScore((prevState) => prevState + 1);
        } else {
          setOpponentScore((prevState) => prevState + 1);
        }
        setPlayGame(false);
      });
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
          ballInfo={ballInfo}
          gameSocket={gameSocket.current}
          gameID={gameID.current}
          player1={player1.current}
          player2={player2.current}
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
