import React from "react";
import styles from "../../styles/Home.module.css";

export function ButtonUpdateChannel({
  updateChannel,
}: {
  updateChannel: () => void;
}) {
  return (
    <div
      className={styles.channel_settings_update}
      onClick={updateChannel}
    >
      Update
    </div>
  );
}
