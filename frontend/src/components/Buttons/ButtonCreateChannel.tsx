import React from "react";
import styles from "../../styles/Home.module.css";

export function ButtonCreateChannel({
  createChannel,
}: {
  createChannel: () => void;
}) {
  return (
    <div
      className={styles.chat_create_channel_form_create}
      onClick={createChannel}
    >
      Create
    </div>
  );
}
