import styles from "../styles/Home.module.css";
import React, { useRef, useState, useContext } from 'react';
import dynamic from "next/dynamic";
import Ball from "../components/Game/Training/Ball";
import PlayerPaddle from "../components/Game/Training/PlayerPaddle";
import ComputerPaddle from "../components/Game/Training/ComputerPaddle";
import Score  from "../components/Game/Training/Score";
import Link from "next/link";

function StopTraining() {
  return (
    <Link href="/">
      <button className={styles.block_button}>
        Exit
      </button>
    </Link>
  );
}

const Training = () => {  
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
        <ComputerPaddle/>
        <StopTraining />
    </>
  );
};



export default dynamic(() => Promise.resolve(Training), {
  ssr: false
})
