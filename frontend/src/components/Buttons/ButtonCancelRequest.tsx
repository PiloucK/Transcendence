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

  const cancelRequest = () => {};

	return (
		<div className={styles.add_friend_button} onClick={cancelRequest}>
			Cancel request
		</div>
	);
}
