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

  const removeFromFriend = () => {
    if (
      loginContext.userLogin !== null &&
      loginContext.userLogin !== userInfos.login42
    ) {
      userServices.removeFriend(loginContext.userLogin, userInfos.login42);
    }
  };

  return (
    <div className={styles.add_friend_button} onClick={removeFromFriend}>
      Remove friend
    </div>
  );
}
