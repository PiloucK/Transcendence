import Image from "next/image";
import React from "react";
import emptyHistory from "../../public/sword-cross.png";
import styles from "../../styles/Home.module.css";
import { CardMatchHistory } from "../Cards/CardMatchHistory";
import matchService from "../../services/match";
import { Match } from "../../interfaces/match";

import { errorHandler } from "../../errors/errorHandler";

import { useErrorContext } from "../../context/ErrorContext";
import { defaultSessionState } from "../../constants/defaultSessionState";
import { useSessionContext } from "../../context/SessionContext";
import { useSocketContext } from "../../context/SocketContext";

function GameList({ userLogin }: { userLogin: string }) {
  const [matches, setMatches] = React.useState<Match[]>([]);
  const sessionContext = useSessionContext();
  const errorContext = useErrorContext();
  const socketContext = useSocketContext();

  const fetchMatch = () => {
    if (
      userLogin !== defaultSessionState.userSelf.login42
    ) {
      matchService
        .getForOneUser(userLogin)
        .then((matches: Match[]) => {
          setMatches(matches);
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
        });
    }
  };

  React.useEffect(fetchMatch, [userLogin]);

  React.useEffect(() => {
    socketContext.socket.on("update-leaderboard", fetchMatch);
    return () => {
      socketContext.socket.removeListener(
        "update-leaderboard",
        fetchMatch
      );
    };
  }, []);

  if (matches.length !== 0) {
    return (
      <>
        {matches.map((match, index: number) => (
          <CardMatchHistory
            key={index}
            match={match}
            userLogin={userLogin}
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
