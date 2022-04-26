import React from "react";
import styles from "../../styles/Home.module.css";

import { IUserPublicInfos } from "../../interfaces/users";

export function ButtonUserStatus({
  userInfos,
}: {
  userInfos: IUserPublicInfos;
}) {
  // Will check the status of the user and display the right button
  const status = Math.random();

  if (status < 0.33) {
    return (
      <div className={styles.social_friend_card_button} onClick={() => {}}>
        Defy
      </div>
    );
  } else if (status < 0.66) {
    return (
      <div className={styles.social_friend_card_button} onClick={() => {}}>
        Spectate
      </div>
    );
  } else {
    return (
      <div className={styles.offline_button} onClick={() => {}}>
        Offline
      </div>
    );
  }
}
