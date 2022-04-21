import React from "react";
import styles from "../styles/Home.module.css";

export function Ball() {
	
  return (
    <div
      className={styles.ball}
      id="ball"
      style={{
        top: window.innerHeight / 2 - 7,
        left: window.innerWidth / 2 - 7,
      }}
    />
  );
}