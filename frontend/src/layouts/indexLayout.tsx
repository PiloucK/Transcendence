import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";
import { DockSelector } from "../components/Dock/DockSelector";
import { useSessionContext } from "../context/SessionContext";
import { useErrorContext } from "../context/ErrorContext";
import { useSocketContext } from "../context/SocketContext";
import { authenticate } from "../events/authenticate";
import { GameInvitation } from "../components/Cards/GameInvitation";
import { useUserStatusContext } from "../context/UserStatusContext";
import { Queue } from "../components/Matchmaking/Queue";
import { defaultSessionState } from "../constants/defaultSessionState";

export const IndexLayout = ({ children }: { children: React.ReactNode }) => {
  const sessionContext = useSessionContext();
  const errorContext = useErrorContext();
  const socketContext = useSocketContext();
  const userStatusContext = useUserStatusContext();

  useEffect(() => {
    authenticate(errorContext, socketContext, sessionContext);
  }, []);

  const findMatch = () => {
    console.log("find-match function button play");

    socketContext.socket.emit(
      "user:find-match",
      sessionContext.userSelf.login42
    );
  };

  return (
    <>
      <GameInvitation />
      {children}
      <div className={styles.mainLayout_left_background} />
      <div className={styles.mainLayout_right_background} />
      {sessionContext.userSelf !== defaultSessionState.userSelf &&
        (userStatusContext.statuses.get(sessionContext.userSelf.login42)
          ?.status === "IN_QUEUE" ? (
          <Queue />
        ) : (
          <div className={styles.play} onClick={findMatch}>
            PLAY
          </div>
        ))}
      <DockSelector />
    </>
  );
};
