import Image from "next/image";
import React, { useState } from "react";
import emptyHistory from "../../public/sword-cross.png";
import styles from "../../styles/Home.module.css";
import { CardMatchHistory } from "../Cards/CardMatchHistory";
import { useSessionContext } from "../../context/SessionContext";
import Avatar from "@mui/material/Avatar";

function GameList({ userLogin }: { userLogin: string }) {
  const [history, setHistory] = React.useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ]);
  const sessionContext = useSessionContext();

  if (history.length !== 0) {
    return (
      <>
        {history.map((game, index: number) => (
          <CardMatchHistory
            key={index}
            index={game}
            userInfos={sessionContext.userSelf}
          />
        ))}
      </>
    );
  } else {
    return (
      <>
        <Image src={emptyHistory} />
        Start playing and show your strength !
      </>
    );
  }
}

export function UserGameHistory({ userLogin }: { userLogin: string }) {
  return (
    <div className={styles.profile_history}>
      <div className={styles.profile_history_title}>Game history</div>
      <div className={styles.profile_history_content}>
        <GameList userLogin={userLogin} />
      </div>
    </div>
  );
}
