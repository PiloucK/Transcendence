import styles from "../styles/Home.module.css";
import { useLoginContext } from "../context/LoginContext";
import React, { useRef, useState, useContext } from 'react';
import { DockGuest } from "../components/Dock/DockGuest";
import userService from "../services/user";

import { errorHandler } from "../errors/errorHandler";

import { useErrorContext } from "../context/ErrorContext";
import { ICoordinates } from "../interfaces/ICoordinates";
import dynamic from "next/dynamic";
import Ball from "../components/Game/Ball";
import PlayerPaddle from "../components/Game/PlayerPaddle";
import ComputerPaddle from "../components/Game/ComputerPaddle";
import Score  from "../components/Game/Score";
import { useSocketContext } from "../context/SocketContext";






const Pong = () => {
  const computerLvl = 3; // peut aller de 1 a 3 EASY MEDIUM HARD
  
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  function updateScore(winner : string) {
    if (winner === 'player')
      setPlayerScore(prevState => (prevState + 1));
    if (winner === 'opponent')
      setOpponentScore(prevState => (prevState + 1));
  }

  return (
    <>
        <div className={styles.mainLayout_left_background} />
        <div className={styles.mainLayout_right_background} />
        <Score player={playerScore} opponent={opponentScore}/>
        <Ball updateScore={updateScore}/>
        <PlayerPaddle/>
        <ComputerPaddle computerLvl={computerLvl}/>
    </>
  );
};



export default dynamic(() => Promise.resolve(Pong), {
  ssr: false
})
