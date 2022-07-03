import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { DockSelector } from "../components/Dock/DockSelector";
import { useSessionContext } from "../context/SessionContext";
import { useErrorContext } from "../context/ErrorContext";
import { useSocketContext } from "../context/SocketContext";
import { authenticate } from "../events/authenticate";
import { GameInvitation } from "../components/Cards/GameInvitation";

export const IndexLayout = ({ children }: { children: React.ReactNode }) => {
  const sessionContext = useSessionContext();
  const errorContext = useErrorContext();
  const socketContext = useSocketContext();

  useEffect(() => {
    authenticate(errorContext, socketContext, sessionContext);
  }, []);

  return (
    <>
      <GameInvitation />
      {children}
      <div className={styles.mainLayout_left_background} />
      <div className={styles.mainLayout_right_background} />
      <Link href="/game">
        <div className={styles.play}>PLAY</div>
      </Link>
      <DockSelector />
    </>
  );
};
