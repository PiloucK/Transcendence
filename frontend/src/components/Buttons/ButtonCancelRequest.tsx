import React from "react";
import styles from "../../styles/Home.module.css";

import { IUserPublicInfos } from "../../interfaces/users";

import userService from "../../services/user";

import { useLoginContext } from "../../context/LoginContext";

import io from "socket.io-client";

import { errorParser } from "../../services/parsing/errorParser";

import getConfig from "next/config";
import { useErrorContext } from "../../context/ErrorContext";
const { publicRuntimeConfig } = getConfig();
const socket = io(
  `http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.WEBSOCKETS_PORT}`,
  { transports: ["websocket"] }
);

export function ButtonCancelRequest({
  userInfos,
}: {
  userInfos: IUserPublicInfos;
}) {
  const errorContext = useErrorContext();
  const loginContext = useLoginContext();

  const cancelRequest = () => {
    if (
      loginContext.userLogin !== null &&
      loginContext.userLogin !== userInfos.login42
    ) {
      userService
        .cancelFriendRequest(loginContext.userLogin, userInfos.login42)
        .then(() => {
          socket.emit("user:update-relations");
        })
        .catch((error) => {
          errorContext.newError?.(errorParser(error));
        });
    }
  };

  return (
    <div className={styles.add_friend_button} onClick={cancelRequest}>
      Cancel request
    </div>
  );
}
