import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { DockSelector } from "../components/Dock/DockSelector";
import { useSessionContext } from "../context/SessionContext";
import { useErrorContext } from "../context/ErrorContext";
import { useSocketContext } from "../context/SocketContext";
import { authenticate } from "../events/authenticate";
import { useUserStatusContext } from "../context/UserStatusContext";

export const IndexLayout = ({ children }: { children: React.ReactNode }) => {
  const sessionContext = useSessionContext();
  const errorContext = useErrorContext();
  const socketContext = useSocketContext();
  const userStatusContext = useUserStatusContext();

  useEffect(() => {
    authenticate(errorContext, socketContext, sessionContext);
  }, []);

  const findMatch = () => {
    console.log('find-match function button play');
    
    socketContext.socket.emit("user:find-match", sessionContext.userSelf.login42);
  };

  return (
    <>
      {children}
      <div className={styles.mainLayout_left_background} />
      <div className={styles.mainLayout_right_background} />
          {userStatusContext.statuses.get(sessionContext.userSelf.login42)
            ?.status !== "IN_QUEUE" && (
              <div className={styles.play} onClick={findMatch}>
                PLAY
              </div>
          )}
      <DockSelector />
    </>
  );
};
