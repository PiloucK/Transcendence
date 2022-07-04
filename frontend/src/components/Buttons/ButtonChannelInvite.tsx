import React from "react";
import styles from "../../styles/Home.module.css";

export function ButtonChannelInvite({
  invite,
}: {
  invite: () => void;
}) {
  return (
    <div
      className={styles.channel_settings_update}
      onClick={invite}
    >
      Send
    </div>
  );
}
