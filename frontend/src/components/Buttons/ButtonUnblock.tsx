import React from "react";
import styles from "../../styles/Home.module.css";

import { IUserPublicInfos } from "../../interfaces/users";

import userServices from "../../services/users";

import { useLoginContext } from "../../context/LoginContext";

import io from "socket.io-client";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig()
const socket = io(`http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.WEBSOCKETS_PORT}`, { transports: ["websocket"] });

export function ButtonUnblock({ userInfos }: { userInfos: IUserPublicInfos }) {
  const loginContext = useLoginContext();

  const unblockAUser = () => {
    if (
      loginContext.userLogin !== null &&
      loginContext.userLogin !== userInfos.login42
    ) {
      userServices
        .unblockUser(loginContext.userLogin, userInfos.login42)
        .then(() => {
          socket.emit("user:update-relations");
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
