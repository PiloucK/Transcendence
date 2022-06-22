import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { DockSelector } from "../components/Dock/DockSelector";
import { useSessionContext } from "../context/SessionContext";
import { useErrorContext } from "../context/ErrorContext";
import { useSocketContext } from "../context/SocketContext";
import { authenticate } from "../events/authenticate";
import { showOverlayOnEscape } from "../events/showOverlayOnEscape";

export const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  const sessionContext = useSessionContext();
  const errorContext = useErrorContext();
  const socketContext = useSocketContext();

  useEffect(() => {
    authenticate(errorContext, socketContext, sessionContext);
  }, []);

  const [showOverlay, setShowOverlay] = useState(false);

  showOverlayOnEscape(showOverlay, setShowOverlay);

  // have to always show children and overlay if the is activated !! lags come from rerendering all components in the page
  return (
    <>
      {showOverlay ? (
        <>
          <div className={styles.mainLayout_left_background} />
          <div className={styles.mainLayout_right_background} />
          <Link href="/game">
            <div className={styles.play}>PLAY</div>
          </Link>
          <DockSelector />
        </>
      ) : (
        children
      )}
    </>
  );
};
