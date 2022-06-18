import React from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { DockSelector } from "../components/Dock/DockSelector";

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
    </>
  );
};
