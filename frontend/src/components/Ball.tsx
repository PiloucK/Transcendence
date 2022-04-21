import React from "react";
import styles from "../styles/Home.module.css";

export function Ball() {
	
  return (
    <div
      className={styles.ball}
      id="ball"
      style={{
        top: "500px",
        left: "960px",
      }}
    />
  );
}