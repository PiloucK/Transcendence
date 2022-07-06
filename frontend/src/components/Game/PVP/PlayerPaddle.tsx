import { useEffect, useRef, useState } from "react";
import styles from "../PaddleLeft.module.css";
import { Socket } from "socket.io-client";
import { useSessionContext } from "../../../context/SessionContext";
import { Login42 } from "../../../interfaces/status.types";

const PlayerPaddle = ({
  gameSocket,
  gameID,
  player1,
}: {
  gameSocket: Socket;
  gameID: string;
  player1: Login42;
}) => {
  const [playerPosition, setPlayerPosition] = useState(50);
  const paddleElem = useRef<HTMLElement | null>(null);
  const sessionContext = useSessionContext();


  useEffect(() => {
    if (paddleElem.current === null) {
      paddleElem.current = document.getElementById("player-paddle");

      if (sessionContext.userSelf.login42 === player1) {
        document.addEventListener("mousemove", (e) => {
          setPlayerPosition((e.y / window.innerHeight) * 100);
        });

        return () => {
          window.removeEventListener("mousemove", () => {});
        };
      } else {
        gameSocket.on(
          "game:newPaddlePosition",
          (newPaddlePosition, playerLogin42) => {
            if (playerLogin42 === player1) {
              setPlayerPosition(newPaddlePosition);
            }
          }
        );
      }
    }
    return () => {};
  }, []);

  useEffect(() => {
    paddleElem.current?.style.setProperty(
      "--position",
      playerPosition.toString()
    );

    if (sessionContext.userSelf.login42 === player1) {
      gameSocket.emit(
        "game:paddleMove",
        playerPosition.toString(),
        gameID,
        sessionContext.userSelf.login42
      );
    }
  });

  return <div className={styles.paddleLeft} id="player-paddle"></div>;
};

export default PlayerPaddle;
