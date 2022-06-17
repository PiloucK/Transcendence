import React from "react";
import styles from "../../styles/Home.module.css";

import { IUserPublic } from "../../interfaces/IUser";

import userService from "../../services/user";

import { useSessionContext } from "../../context/SessionContext";

import { errorHandler } from "../../errors/errorHandler";

import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";

export function ButtonUnblock({ userInfos }: { userInfos: IUserPublic }) {
  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();

  const unblockAUser = () => {
    if (
      sessionContext.userSelf.login42 !== null &&
      sessionContext.userSelf.login42 !== userInfos.login42
    ) {
      userService
        .unblockUser(sessionContext.userSelf.login42, userInfos.login42)
        .then(() => {
          socketContext.socket.emit("user:update-relations");
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
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
