import React from "react";
import styles from "../../styles/Home.module.css";
import { IUserSlim } from "../../interfaces/IUser";
import { useSessionContext } from "../../context/SessionContext";
import userService from "../../services/user";
import { errorHandler } from "../../errors/errorHandler";
import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";

export function ButtonsFriendRequest({ userInfos }: { userInfos: IUserSlim }) {
  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();

  const acceptFriend = () => {
    userService
      .acceptFriendRequest(sessionContext.userSelf.login42, userInfos.login42)
      .then(() => {
        socketContext.socket.emit("user:update-relations");
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });
  };

  const declineRequest = () => {
    userService
      .declineFriendRequest(sessionContext.userSelf.login42, userInfos.login42)
      .then(() => {
        socketContext.socket.emit("user:update-relations");
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });
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
