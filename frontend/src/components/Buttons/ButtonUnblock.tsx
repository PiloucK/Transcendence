import React from "react";
import styles from "../../styles/Home.module.css";

import { IUserPublicInfos } from "../../interfaces/users";

import userService from "../../services/user";

import { useLoginContext } from "../../context/LoginContext";

import io from "socket.io-client";

import { errorParser } from "../../services/errorParser";

import getConfig from "next/config";
import { useErrorContext } from "../../context/ErrorContext";
const { publicRuntimeConfig } = getConfig();
const socket = io(
  `http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.WEBSOCKETS_PORT}`,
  { transports: ["websocket"] }
);

export function ButtonUnblock({ userInfos }: { userInfos: IUserPublicInfos }) {
  const errorContext = useErrorContext();
  const loginContext = useLoginContext();

  const unblockAUser = () => {
    if (
      loginContext.userLogin !== null &&
      loginContext.userLogin !== userInfos.login42
    ) {
      userService
        .unblockUser(loginContext.userLogin, userInfos.login42)
        .then(() => {
          socket.emit("user:update-relations");
        })
        .catch((error) => {
          errorContext.newError?.(errorParser(error));
        });
    }
  };

  return (
    <div
      className={styles.social_friend_card_unblock_button}
      onClick={unblockAUser}
    >
      Unblock
    </div>
  );
}
