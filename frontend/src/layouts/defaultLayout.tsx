import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { DockSelector } from "../components/Dock/DockSelector";
import { useSessionContext } from "../context/SessionContext";
import { useErrorContext } from "../context/ErrorContext";
import { useSocketContext } from "../context/SocketContext";
import { authenticate } from "../events/authenticate";
import { showOverlayOnEscape } from "../events/showOverlayOnEscape";
import { GameInvitation } from "../components/Cards/GameInvitation";
import { useUserStatusContext } from "../context/UserStatusContext";

export const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  const sessionContext = useSessionContext();
  const errorContext = useErrorContext();
  const socketContext = useSocketContext();
  const userStatusContext = useUserStatusContext();

  useEffect(() => {
    authenticate(errorContext, socketContext, sessionContext);
  }, []);

  const [showOverlay, setShowOverlay] = useState(false);

  const findMatch = () => {
    socketContext.socket.emit(
      "user:find-match",
      sessionContext.userSelf.login42
    );
  };
  // showOverlayOnEscape(showOverlay, setShowOverlay);

  // have to always show children and overlay if the is activated !! lags come from rerendering all components in the page
  return (
    <>
      {/* {showOverlay ? (
        <>
          <div className={styles.mainLayout_left_background} />
          <div className={styles.mainLayout_right_background} />
          {userStatusContext.statuses.get(sessionContext.userSelf.login42)
            ?.status === "ONLINE" && (
            <div className={styles.play} onClick={findMatch}>
              PLAY
            </div>
          )}
          <DockSelector />
        </>
      ) : ( */}
		<GameInvitation />
        {children}
    {/*   )} */}
    </>
  );
};
