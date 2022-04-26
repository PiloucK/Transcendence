import React from "react";
import styles from "../../styles/Home.module.css";

import { IUserPublicInfos } from "../../interfaces/users";

export function ButtonsFriendRequest({
  userInfos,
}: {
  userInfos: IUserPublicInfos;
}) {
  return (
    <div className={styles.social_friend_request_card_button}>
      <div className={styles.confirm} onClick={() => {}}>
        Confirm
      </div>
      <div className={styles.decline} onClick={() => {}}>
        Decline
      </div>
    </div>
  );
}
