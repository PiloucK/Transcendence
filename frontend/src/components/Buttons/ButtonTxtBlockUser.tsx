import React from "react";

import styles from "../../styles/Home.module.css";

import { IUserPublic, IUserSlim } from "../../interfaces/IUser";
import userService from "../../services/user";
import { useSessionContext } from "../../context/SessionContext";
import { errorHandler } from "../../errors/errorHandler";
import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";

export function ButtonTxtBlockUser({ login }: { login: string }) {
  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();

  const handleUnblockOnClick = () => {
    if (
      sessionContext.userSelf.login42 !== null &&
      sessionContext.userSelf.login42 !== login
    ) {
      userService
        .unblockUser(sessionContext.userSelf.login42, login)
        .then(() => {
          socketContext.socket.emit("user:update-relations");
          socketContext.socket.emit("user:update-direct-messages");
          socketContext.socket.emit("user:update-channel-content");
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
        });
    }
  };

  const handleBlockOnClick = () => {
    if (
      sessionContext.userSelf.login42 !== null &&
      sessionContext.userSelf.login42 !== login
    ) {
      userService
        .blockUser(sessionContext.userSelf.login42, login)
        .then(() => {
          socketContext.socket.emit("user:update-relations");
          socketContext.socket.emit("user:update-direct-messages");
          socketContext.socket.emit("user:update-channel-content");
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
        });
    }
  };

  if (sessionContext.userSelf.blockedUsers.find((blocked: IUserSlim) => blocked.login42 === login)) {
    return (
      <div className={styles.buttons} onClick={handleUnblockOnClick}>
        Unblock
      </div>
    );
  } else {
    return (
      <div className={styles.buttons} onClick={handleBlockOnClick}>
        Block
      </div>
    );
  }
}
