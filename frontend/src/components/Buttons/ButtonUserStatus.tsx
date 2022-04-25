import React from "react";
import styles from "../../styles/Home.module.css";

import { IUserPublicInfos } from "../../interfaces/users";

export function ButtonUserStatus({
  userInfos,
}: {
  userInfos: IUserPublicInfos;
}) {
  return (
    <div className={styles.social_friend_card_button} onClick={() => {}}>
      Defy
    </div>
  );
}
