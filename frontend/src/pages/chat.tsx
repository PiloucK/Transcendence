import React from "react";
import styles from "../styles/Home.module.css";

function DirectMessage() {
  return (
    <>
      <div className={styles.chat_direct_message_menu}>Direct Message</div>
      <div className={styles.chat_direct_message_content}>Content</div>
    </>
  );
}

export default function Chat() {
  return (
    <>
      <div className={styles.chat_menu}>Hey</div>
      <DirectMessage />
    </>
  );
}
