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

const { publicRuntimeConfig } = getConfig();
const Pong = () => {
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  const gameSocket = useRef<Socket>();
  const gameID = useRef("null");

  const sessionContext = useSessionContext();
  const { opponentLogin42 } = useRouter().query;

  const secondMount = useRef(false);
  const [playGame, setPlayGame] = useState(false);

  function updateScore(winner: string) {
    if (winner === "player") setPlayerScore((prevState) => prevState + 1);
    if (winner === "opponent") setOpponentScore((prevState) => prevState + 1);
    setPlayGame(false);
  }

  // if (gameSocket.current) {
  //   gameSocket.current.onAny((event, ...args) => {
  //     console.log(event, args);
  //   });
  // }

  useEffect(() => {
    console.log("USE EFFECT PONG");

    if (gameSocket.current === undefined) {
      gameSocket.current = io(
        `http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.WEBSOCKETS_PORT}/game`,
        { transports: ["websocket"] }
      );
      gameSocket.current.on("game:start", (newGameID: string) => {
        setPlayGame(true);
        gameID.current = newGameID;
        console.log("GAME STARTING FROM FRONT...");
      });

      gameSocket.current.emit(
        "game:enter",
        "vlugand-",
        "coucou",
        sessionContext.userSelf.login42
      );
    }
    return () => {
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

  if (gameSocket.current === undefined) {
    return (
      <div className={styles.mainLayout_background}>
        <Score
          player={playerScore.toString()}
          opponent={opponentScore.toString()}
        />
      </div>
    );
  } else if (playGame === true) {
    return (
      <div className={styles.mainLayout_background}>
        <Score
          player={playerScore.toString()}
          opponent={opponentScore.toString()}
        />
        <Ball updateScore={updateScore} gameSocket={gameSocket.current} />
        <PlayerPaddle gameSocket={gameSocket.current} gameID={gameID.current} />
        <OpponentPaddle gameSocket={gameSocket.current} />
      </div>
    );
  } else {
    return (
      <div className={styles.mainLayout_background}>
        <Score
          player={playerScore.toString()}
          opponent={opponentScore.toString()}
        />
        <PlayerPaddle gameSocket={gameSocket.current} gameID={gameID.current} />
        <OpponentPaddle gameSocket={gameSocket.current} />
      </div>
    );
  }
};

export default dynamic(() => Promise.resolve(Pong), {
  ssr: false,
});

Pong.getLayout = function getLayout(page: ReactElement) {
  return <InGameLayout>{page}</InGameLayout>;
};

// opponent={
//   Array.isArray(opponentLogin42) ? opponentLogin42[0] : opponentLogin42
// }
