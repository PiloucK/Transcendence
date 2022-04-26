import React from "react";
import styles from "../../styles/Home.module.css";

import { IUserPublicInfos } from "../../interfaces/users";

import userServices from "../../services/users";

import { useLoginContext } from "../../context/LoginContext";

export function ButtonRemoveFriend({
  userInfos,
}: {
  userInfos: IUserPublicInfos;
}) {
  const loginContext = useLoginContext();

  const removeFromFriend = () => {};

  return (
    <div className={styles.add_friend_button} onClick={removeFromFriend}>
      Remove friend
    </div>
  );
}
