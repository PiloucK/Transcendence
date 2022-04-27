import React from "react";
import styles from "../../styles/Home.module.css";

import { IUserPublicInfos } from "../../interfaces/users";

import userServices from "../../services/users";

import { useLoginContext } from "../../context/LoginContext";

export function ButtonCancelRequest({
  userInfos,
}: {
  userInfos: IUserPublicInfos;
}) {
  const loginContext = useLoginContext();

  const cancelRequest = () => {
    if (
      loginContext.userLogin !== null &&
      loginContext.userLogin !== userInfos.login42
    ) {
      userServices.cancelFriendRequest(
        loginContext.userLogin,
        userInfos.login42
      );
    }
  };

  return (
    <div className={styles.add_friend_button} onClick={cancelRequest}>
      Cancel request
    </div>
  );
}
