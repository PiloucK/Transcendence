import { useEffect, useRef, useState } from "react";
import styles from './PaddleRight.module.css'
import { io, Socket } from "socket.io-client";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();


const OpponentPaddle = ({ gameSocket}: { gameSocket: Socket}) => {
 
  const [paddlePosition, setPaddlePosition] = useState(50);

  gameSocket.on("game:paddlePosition", (newPaddlePosition) => {
    setPaddlePosition(newPaddlePosition);
   
  });

  useEffect(() => {
    const paddleElem = document.getElementById("opponent-paddle") as HTMLElement;
    paddleElem.style.setProperty("--position", paddlePosition.toString());
  });

    return (
      <div className={styles.paddleRight} id="opponent-paddle"></div>
    );
};

export default OpponentPaddle;
