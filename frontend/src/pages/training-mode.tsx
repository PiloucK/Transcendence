import styles from "../styles/Home.module.css";
import React, { useRef, useState, useContext } from "react";
import dynamic from "next/dynamic";
import Ball from "../components/Game/Training/Ball";
import PlayerPaddle from "../components/Game/Training/PlayerPaddle";
import ComputerPaddle from "../components/Game/Training/ComputerPaddle";
import Score from "../components/Game/Training/Score";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";

const Training = () => {
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  const { computerlvl } = useRouter().query;

  const [parsedLvl, setParsedLvl] = useState(0);

  function updateScore(winner: string) {
    if (winner === "player") setPlayerScore((prevState) => prevState + 1);
    if (winner === "opponent") setOpponentScore((prevState) => prevState + 1);
  }

  if (computerlvl && parsedLvl === 0) {
    setParsedLvl(() => {
      let lvl = parseInt(
        Array.isArray(computerlvl) ? computerlvl[0] : computerlvl
      );
      if (lvl < 1) lvl = 1;
      else if (lvl > 3) lvl = 3;
      return lvl;
    });
  }

  if (parsedLvl) {
    return (
      <>
        <div className={styles.mainLayout_left_background} />
        <div className={styles.mainLayout_right_background} />
        <Score player={playerScore} opponent={opponentScore} />
        <Ball updateScore={updateScore} />
        <PlayerPaddle />
        <ComputerPaddle computerlvl={parsedLvl} />
      </>
    );
  } else {
    return (
      <>
        <div className={styles.mainLayout_left_background} />
        <div className={styles.mainLayout_right_background} />
        <CircularProgress className={styles.queue_circular_progress} />
      </>
    );
  }
};

export default dynamic(() => Promise.resolve(Training), {
  ssr: false,
});
