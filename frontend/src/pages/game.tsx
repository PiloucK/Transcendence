import styles from "../styles/Home.module.css";
import { useLoginContext } from "../context/LoginContext";
import React from "react";
import { DockGuest } from "../components/Dock/DockGuest";
import { Ball } from "../components/Ball";

function DisplayBallForUser() {
  const loginContext = useLoginContext();

  if (loginContext.userName !== null) {
    return <Ball />;
  } else {
    return <DockGuest />;
  }
}

const moveBall = (e: KeyboardEvent) => {
  let ball = document.getElementById("ball");

  if (ball !== null) {
    if (e.key === "ArrowUp") {
      ball.style.top = parseInt(ball.style.top) - 20 + "px";
    } else if (e.key === "ArrowDown") {
      ball.style.top = parseInt(ball.style.top) + 20 + "px";
    } else if (e.key === "ArrowLeft") {
      ball.style.left = parseInt(ball.style.left) - 20 + "px";
    } else if (e.key === "ArrowRight") {
      ball.style.left = parseInt(ball.style.left) + 20 + "px";
    }
  }
};

export default function Game() {
  if (typeof window !== "undefined") {
    document.addEventListener("keydown", moveBall);
  }

  return (
    <>
      <div className={styles.mainLayout_left_background} />
      <div className={styles.mainLayout_right_background} />
			<div className={styles.left_line} />
			<div className={styles.right_line} />
      <DisplayBallForUser />
    </>
  );
}
