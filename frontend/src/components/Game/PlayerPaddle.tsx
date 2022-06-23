import { useEffect, useState } from "react";
import styles from "./PaddleLeft.module.css";
import { io, Socket } from "socket.io-client";
import { useLoginContext } from "../../context/LoginContext";

const PlayerPaddle = ({ gameSocket, gameID}: { gameSocket: Socket, gameID : string }) => {
  const [playerPosition, setPlayerPosition] = useState(50);
  const LoginContext = useLoginContext();

  useEffect(() => {
    document.addEventListener("mousemove", (e) => {
      setPlayerPosition((e.y / window.innerHeight) * 100);
    });

    return () => {
      window.removeEventListener("mousemove", () => {});
    };
  }, []);

  useEffect(() => {
    const paddleElem = document.getElementById("player-paddle") as HTMLElement;
    paddleElem.style.setProperty("--position", playerPosition.toString());
    gameSocket.emit("game:paddles", LoginContext.userLogin, playerPosition.toString(), gameID);
  });

  return <div className={styles.paddleLeft} id="player-paddle"></div>;
};

export default PlayerPaddle;
