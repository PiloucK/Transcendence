import React from "react";
import styles from "../../styles/Home.module.css";

import { IUserPublic } from "../../interfaces/IUser";

export function ButtonUserStatus({
  userInfos,
}: {
  userInfos: IUserPublic;
}) {
  // Will check the status of the user and display the right button
  const status = Math.random();

  if (userInfos.online === true) {
    return (
      <div className={styles.social_friend_card_button} onClick={() => {}}>
        Defy
      </div>
    );
  // } else if (userInfos.online === true) {
  //   return (
  //     <div className={styles.social_friend_card_button} onClick={() => {}}>
  //       Spectate
  //     </div>
  //   );
  } else {
    return (
      <div className={styles.offline_button} onClick={() => {}}>
        Offline
      </div>
    );
  }
}
