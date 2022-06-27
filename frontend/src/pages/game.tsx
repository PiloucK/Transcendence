import styles from "../styles/Home.module.css";
import { ReactElement, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Ball from "../components/Game/Ball";
import PlayerPaddle from "../components/Game/PlayerPaddle";
import ComputerPaddle from "../components/Game/ComputerPaddle";
import Score from "../components/Game/Score";
import { InGameLayout } from "../layouts/inGameLayout";
import { useRouter } from "next/router";
import { useSessionContext } from "../context/SessionContext";

const Pong = () => {
  const computerLvl = 3; // peut aller de 1 a 3 EASY MEDIUM HARD

  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const sessionContext = useSessionContext();
  const { opponentLogin42 } = useRouter().query;

  function updateScore(winner: string) {
    if (winner === "player") setPlayerScore((prevState) => prevState + 1);
    if (winner === "opponent") setOpponentScore((prevState) => prevState + 1);
  }

  return (
    <>
      <div className={styles.mainLayout_left_background} />
      <div className={styles.mainLayout_right_background} />
      <Score
        player={sessionContext.userSelf.login42}
        opponent={
          Array.isArray(opponentLogin42) ? opponentLogin42[0] : opponentLogin42
        }
      />
      {/* <Ball updateScore={updateScore} /> */}
      {/* <PlayerPaddle />
      <ComputerPaddle computerLvl={computerLvl} /> */}
    </>
  );
};

export default dynamic(() => Promise.resolve(Pong), {
  ssr: false,
});

Pong.getLayout = function getLayout(page: ReactElement) {
  return <InGameLayout>{page}</InGameLayout>;
};
