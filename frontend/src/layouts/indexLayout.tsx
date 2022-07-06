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
import Link from "next/link";


const PlayButton = () => {
	const socketContext = useSocketContext();
	const sessionContext = useSessionContext();
	const userStatusContext = useUserStatusContext();
  
	const findMatch = () => {
	  console.log("find-match function button play");
  
	  socketContext.socket.emit(
		"user:find-match",
		sessionContext.userSelf.login42
	  );
	};
  
	if (sessionContext.userSelf !== defaultSessionState.userSelf) {
	  if (
		userStatusContext.statuses.get(sessionContext.userSelf.login42)
		  ?.status === "IN_QUEUE"
	  ) {
		return <Queue />;
	  } else {
		return (
		  <div className={styles.play} onClick={findMatch}>
			PLAY
		  </div>
		);
	  }
	}
	return  (
	  <Link href="/training-mode" className={styles.play}>
		<div className={styles.play}>PLAY</div>
	  </Link>
	);;
  };

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
      <PlayButton />
      <DockSelector />
    </>
  );
};
