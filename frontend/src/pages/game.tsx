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
  const gameID = useRef("");
  const player1 = useRef("");
  const player2 = useRef("");
  const invert = useRef(0);

  const sessionContext = useSessionContext();
  const { userLogin42, opponentLogin42 } = useRouter().query;

  const secondMount = useRef(false);
  const [gameReady, setGameReady] = useState(false);
  const [winnerLogin42, setWinnerLogin42] = useState("");
  const router = useRouter();
  const isPointLost = useRef<boolean>(false);

  useEffect(() => {
    if (gameSocket.current === undefined) {
      gameSocket.current = io(
        `http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.WEBSOCKETS_PORT}/game`,
        { transports: ["websocket"] }
      );

      gameSocket.current.emit(
        "game:enter",
        Array.isArray(userLogin42) ? userLogin42[0] : userLogin42,
        Array.isArray(opponentLogin42) ? opponentLogin42[0] : opponentLogin42,
        sessionContext.userSelf.login42
      );

      gameSocket.current.on(
        "game:init",
        (
          newGameID: string,
          p1: Login42,
          p2: Login42,
          p1Score: number,
          p2Score: number
        ) => {
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

          if (
            p1 === sessionContext.userSelf.login42 ||
            p2 === sessionContext.userSelf.login42
          ) {
            gameSocket.current?.emit("game:new-point", gameID.current);
          }

          setPlayerScore(p1Score);
          undefined;
          setOpponentScore(p2Score);
          setGameReady(true);
        }
      );

      gameSocket.current.on("game:update-score", (login42: Login42) => {
        isPointLost.current = false;
        if (login42 !== player1.current) {
          setPlayerScore((prevState) => prevState + 1);
        } else {
          setOpponentScore((prevState) => prevState + 1);
        }
      });

      gameSocket.current.on("game:winner", (Login42: Login42) => {
        setWinnerLogin42(Login42);

        setTimeout(() => {
          router.push("/");
        }, 5000);
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
            gameID.current,
            sessionContext.userSelf.login42
          );
          console.log("closing socket");
          // IF SPECATOR LEAVES HE STOPS THE GAME
        }
      }
    };
  }, []);

  if (gameSocket.current === undefined || gameReady === false) {
    return (
      <div className={styles.mainLayout_background}>
        <Score player={playerScore} opponent={playerScore} />
      </div>
    );
  }
  return (
    <div className={styles.mainLayout_background}>
      {winnerLogin42 !== "" && (
        <div className={styles.play}>Well played {winnerLogin42}</div>
      )}
      <Score player={playerScore} opponent={opponentScore} />
      <Ball
        gameSocket={gameSocket.current}
        gameID={gameID.current}
        isPointLost={isPointLost}
      />
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
