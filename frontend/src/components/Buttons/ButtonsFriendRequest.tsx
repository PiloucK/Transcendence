import React from "react";
import styles from "../../styles/Home.module.css";

import { IUserPublicInfos } from "../../interfaces/users";
import { useLoginContext } from "../../context/LoginContext";
import userService from "../../services/user";

import io from "socket.io-client";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig()
const socket = io(`http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.WEBSOCKETS_PORT}`, { transports: ["websocket"] });

export function ButtonsFriendRequest({
  userInfos,
}: {
  userInfos: IUserPublicInfos;
}) {
  const loginContext = useLoginContext();

  const acceptFriend = () => {
    if (
      loginContext.userLogin !== null &&
      loginContext.userLogin !== userInfos.login42
    ) {
      userService
        .acceptFriendRequest(loginContext.userLogin, userInfos.login42)
        .then(() => {
          socket.emit("user:update-relations");
        });
    }
  };

  const declineRequest = () => {
    if (
      loginContext.userLogin !== null &&
      loginContext.userLogin !== userInfos.login42
    ) {
      userService
        .declineFriendRequest(loginContext.userLogin, userInfos.login42)
        .then(() => {
          socket.emit("user:update-relations");
        });
    }
  };

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
