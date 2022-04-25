import React from "react";
import styles from "../../styles/Home.module.css";

import { IUserPublicInfos } from "../../interfaces/users";

import userServices from "../../services/users";

import { useLoginContext } from "../../context/LoginContext";

export function ButtonAddFriend({
  userInfos,
}: {
  userInfos: IUserPublicInfos;
}) {
	const loginContext = useLoginContext();

  const sendFriendRequest = () => {
		if (loginContext.userLogin !== null && loginContext.userLogin !== userInfos.login42) {
			userServices.sendFriendRequest(loginContext.userLogin, userInfos.login42);
		}
  };

  return (
    <div
      className={styles.add_friend_button}
      onClick={sendFriendRequest}
    >
      Add friend
    </div>
  );
}
