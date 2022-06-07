import React from "react";
import styles from "../../styles/Home.module.css";

import { IUserPublicInfos } from "../../interfaces/users";

import userService from "../../services/user";

import { useLoginContext } from "../../context/LoginContext";

import { errorHandler } from "../../errors/errorHandler";

import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";

export function ButtonBlock({ userInfos }: { userInfos: IUserPublicInfos }) {
  const errorContext = useErrorContext();
  const loginContext = useLoginContext();
  const socketContext = useSocketContext();

  const blockAUser = () => {
    if (
      loginContext.userLogin !== null &&
      loginContext.userLogin !== userInfos.login42
    ) {
      userService
        .blockUser(loginContext.userLogin, userInfos.login42)
        .then(() => {
          socketContext.socket.emit("user:update-relations");
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, loginContext));
        });
    }
  };

  return (
    <div className={styles.block_button} onClick={blockAUser}>
      Block
    </div>
  );
}
