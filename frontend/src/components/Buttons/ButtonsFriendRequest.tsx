import React from "react";
import styles from "../../styles/Home.module.css";

import { IUserPublicInfos } from "../../interfaces/users";
import { useLoginContext } from "../../context/LoginContext";
import userServices from "../../services/users";

export function ButtonsFriendRequest({
  userInfos,
}: {
  userInfos: IUserPublicInfos;
}) {
	const loginContext = useLoginContext();

	const acceptFriend = () => {
		if (loginContext.userLogin !== null && loginContext.userLogin !== userInfos.login42) {
			userServices.acceptFriendRequest(loginContext.userLogin, userInfos.login42);
		}
	}

	const declineRequest = () => {
		if (loginContext.userLogin !== null && loginContext.userLogin !== userInfos.login42) {
			userServices.declineFriendRequest(loginContext.userLogin, userInfos.login42);
		}
	}

  return (
    <div className={styles.social_friend_request_card_button}>
      <div className={styles.confirm} onClick={acceptFriend}>
        Confirm
      </div>
      <div className={styles.decline} onClick={declineRequest}>
        Decline
      </div>
    </div>
  );
}
