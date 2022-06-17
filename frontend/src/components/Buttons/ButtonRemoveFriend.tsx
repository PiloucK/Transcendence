import React from "react";
import styles from "../../styles/Home.module.css";

import { IUserPublic } from "../../interfaces/IUser";

import userService from "../../services/user";

import { useSessionContext } from "../../context/SessionContext";

import { errorHandler } from "../../errors/errorHandler";

import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";

export function ButtonRemoveFriend({
  userInfos,
}: {
  userInfos: IUserPublic;
}) {
  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();

  const removeFromFriend = () => {
    if (
      sessionContext.userLogin !== null &&
      sessionContext.userLogin !== userInfos.login42
    ) {
      userService
        .removeFriend(sessionContext.userLogin, userInfos.login42)
        .then(() => {
          socketContext.socket.emit("user:update-relations");
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
        });
    }
  };

  return (
    <div className={styles.add_friend_button} onClick={removeFromFriend}>
      Remove friend
    </div>
  );
}
