import { useEffect, useRef, useState } from "react";
import styles from "../PaddleRight.module.css";
import { Socket } from "socket.io-client";
import { Login42 } from "../../../interfaces/status.types";

const OpponentPaddle = ({
  gameSocket,
  player2,
}: {
  gameSocket: Socket;
  player2: Login42;
}) => {
  const [paddlePosition, setPaddlePosition] = useState(50);
  const paddleElem = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (paddleElem.current === null) {
      paddleElem.current = document.getElementById("opponent-paddle");
      gameSocket.on(
        "game:newPaddlePosition",
        (newPaddlePosition, playerLogin42) => {
          if (playerLogin42 === player2) {
            setPaddlePosition(newPaddlePosition);
          }
        }
      );
    }
  }, []);

  useEffect(() => {
    paddleElem.current?.style.setProperty(
      "--position",
      paddlePosition.toString()
    );
  });

  return <div className={styles.paddleRight} id="opponent-paddle"></div>;
};

export default OpponentPaddle;
