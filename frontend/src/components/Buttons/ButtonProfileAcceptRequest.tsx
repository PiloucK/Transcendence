import React from "react";
import styles from "../../styles/Home.module.css";

import userService from "../../services/user";

import { errorHandler } from "../../errors/errorHandler";

import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";
import { useSessionContext } from "../../context/SessionContext";
import { IUserSlim } from "../../interfaces/IUser";

export function ButtonProfileAcceptRequest({
  displayedUser,
}: {
  displayedUser: IUserSlim;
}) {
  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();

  const acceptFriend = async () => {
    await userService
      .acceptFriendRequest(
        sessionContext.userSelf.login42,
        displayedUser.login42
      )
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });

    socketContext.socket.emit("user:update-relations");
  };

  return (
    <button className={styles.add_friend_button} onClick={acceptFriend}>
      Accept request
    </button>
  );
}
