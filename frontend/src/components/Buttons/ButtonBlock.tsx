import React from "react";
import styles from "../../styles/Home.module.css";

import { IUserPublicInfos } from "../../interfaces/users";

import userServices from "../../services/users";

import { useLoginContext } from "../../context/LoginContext";

import io from "socket.io-client";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig()
const socket = io(`http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.WEBSOCKETS_PORT}`, { transports: ["websocket"] });

export function ButtonBlock({ userInfos }: { userInfos: IUserPublicInfos }) {
  const loginContext = useLoginContext();

  const blockAUser = () => {
    if (
      loginContext.userLogin !== null &&
      loginContext.userLogin !== userInfos.login42
    ) {
      userServices
        .blockUser(loginContext.userLogin, userInfos.login42)
        .then(() => {
          socket.emit("user:update-relations");
        });
    }
  };
	
  return (
    <div className={styles.block_button} onClick={blockAUser}>
      Block
    </div>
  );
}
