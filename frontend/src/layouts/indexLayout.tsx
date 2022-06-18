import React from "react";
import Router from "next/router";
import { DockGuest } from "../components/Dock/DockGuest";
import { useSessionContext } from "../context/SessionContext";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { defaultSessionState } from "../constants/defaultSessionState";
import { SecondFactorLogin } from "../components/Alerts/SecondFactorLogin";
import { DockUser } from "../components/Dock/DockUser";

function DockSelector() {
  const sessionContext = useSessionContext();

  if (sessionContext.userSelf != defaultSessionState.userSelf) {
    return <DockUser />;
  } else {
    return <DockGuest />;
  }
}

export const IndexLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <div className={styles.mainLayout_left_background} />
      <div className={styles.mainLayout_right_background} />
      <Link href="/game">
        <div className={styles.play}>PLAY</div>
      </Link>
      <DockSelector />
      <SecondFactorLogin />
    </>
  );
};
