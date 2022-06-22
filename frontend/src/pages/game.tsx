import styles from "../styles/Home.module.css";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Ball from "../components/Game/Ball";
import PlayerPaddle from "../components/Game/PlayerPaddle";
import ComputerPaddle from "../components/Game/ComputerPaddle";
import OpponentPaddle from "../components/Game/OpponentPaddle";

import Score from "../components/Game/Score";
import { io, Socket } from "socket.io-client";
import getConfig from "next/config";
import { useLoginContext } from "../context/LoginContext";
const { publicRuntimeConfig } = getConfig();

const Pong = () => {
  const computerLvl = 3; // peut aller de 1 a 3 EASY MEDIUM HARD

  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const gameSocket = useRef<Socket>();

  const LoginContext = useLoginContext();
  const toto = useRef(true);
  const secondMount = useRef(false);
  const [startGame, setStartGame] = useState(false);

  function updateScore(winner: string) {
    if (winner === "player") setPlayerScore((prevState) => prevState + 1);
    if (winner === "opponent") setOpponentScore((prevState) => prevState + 1);
  }

  if (gameSocket.current && toto.current) {
    console.log("toto", playerScore);
    gameSocket.current.emit("game:point", LoginContext.userLogin);
    toto.current = !toto.current;
  } else {
    toto.current = !toto.current;
  }

  useEffect(() => {
    console.log("USE EFFECT PONG");

    if (gameSocket.current === undefined) {
      gameSocket.current = io(
        `http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.WEBSOCKETS_PORT}/game`,
        { transports: ["websocket"] }
      );
      gameSocket.current.on("game:start", () => {
        setStartGame(true);
        console.log("GAME STARTING FROM FRONT...");
      });

      gameSocket.current.emit(
        "game:enter",
        "vlugand-",
        "mvidal-a",
        LoginContext.userLogin
      );
    }
    return () => {
      if (secondMount.current !== true) {
        secondMount.current = true;
      } else {
        console.log("unmounting game");
        if (gameSocket.current != undefined) {
          gameSocket.current.emit("game:unmount", LoginContext.userLogin);
          console.log("closing socket");
        }
      }
    };
  }, []);

  if (gameSocket.current === undefined || startGame === false) {
    return (
      <>
        <div className={styles.mainLayout_left_background} />
        <div className={styles.mainLayout_right_background} />
        <Score player={playerScore} opponent={opponentScore} />
        {/* <PlayerPaddle gameSocket={gameSocket.current} /> */}
        {/* <ComputerPaddle computerLvl={computerLvl} /> */}
        {/* <OpponentPaddle /> */}
      </>
    );
  } else {
    return (
      <>
        <div className={styles.mainLayout_left_background} />
        <div className={styles.mainLayout_right_background} />
        <Score player={playerScore} opponent={opponentScore} />
        <Ball updateScore={updateScore} gameSocket={gameSocket.current} />
        <PlayerPaddle gameSocket={gameSocket.current} />
        {/* <ComputerPaddle computerLvl={computerLvl} /> */}
        <OpponentPaddle />
      </>
    );
  }
};

export default dynamic(() => Promise.resolve(Pong), {
  ssr: false,
});
