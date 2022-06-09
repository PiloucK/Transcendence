import React from "react";
import styles from "../../styles/Home.module.css";

import { IUserPublicInfos } from "../../interfaces/users";
import { useLoginContext } from "../../context/LoginContext";
import userService from "../../services/user";

import { errorHandler } from "../../errors/errorHandler";

import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";

export function ButtonsFriendRequest({
  userInfos,
}: {
  userInfos: IUserPublicInfos;
}) {
  const errorContext = useErrorContext();
  const loginContext = useLoginContext();
  const socketContext = useSocketContext();

  const acceptFriend = async () => {
    if (
      loginContext.userLogin !== null &&
      loginContext.userLogin !== userInfos.login42
    ) {
      await userService
        .acceptFriendRequest(loginContext.userLogin, userInfos.login42)
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, loginContext));
        });

      socketContext.socket.emit("user:update-relations");
    }
  };

  const declineRequest = async () => {
    if (
      loginContext.userLogin !== null &&
      loginContext.userLogin !== userInfos.login42
    ) {
      await userService
        .declineFriendRequest(loginContext.userLogin, userInfos.login42)
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, loginContext));
        });

      socketContext.socket.emit("user:update-relations");
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
