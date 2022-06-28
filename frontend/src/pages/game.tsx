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

const { publicRuntimeConfig } = getConfig();
const Pong = () => {
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  const gameSocket = useRef<Socket>();
  const gameID = useRef("null");
  const player1 = useRef("null");
  const player2 = useRef("null");

  const sessionContext = useSessionContext();
  const { userLogin42, opponentLogin42 } = useRouter().query;

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

  console.log("gamesock", gameSocket.current);

  useEffect(() => {
    console.log("USE EFFECT PONG");

    if (gameSocket.current === undefined) {
      gameSocket.current = io(
        `http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.WEBSOCKETS_PORT}/game`,
        { transports: ["websocket"] }
      );
      // edit for spectating
      gameSocket.current.on(
        "game:start",
        (newGameID: string, p1: Login42, p2: Login42) => {
          setPlayGame(true);
          gameID.current = newGameID;
          if (p2 === sessionContext.userSelf.login42) {
            player1.current = p2;
            player2.current = p1;
          } else {
            player1.current = p1;
            player2.current = p2;
          }
          console.log("GAME STARTING FROM FRONT...");
        }
      );

      console.log(
        "queries: ",
        Array.isArray(userLogin42) ? userLogin42[0] : userLogin42,
        Array.isArray(opponentLogin42) ? opponentLogin42[0] : opponentLogin42
      );

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

  if (gameSocket.current === undefined) {
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
        <Ball updateScore={updateScore} gameSocket={gameSocket.current} />
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
