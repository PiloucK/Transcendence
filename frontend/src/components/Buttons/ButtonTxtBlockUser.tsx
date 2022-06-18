import React from "react";

import styles from "../../styles/Home.module.css";

import { IUserPublicInfos } from "../../interfaces/users";
import userService from "../../services/user";
import { useLoginContext } from "../../context/LoginContext";
import { errorHandler } from "../../errors/errorHandler";
import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";

export function ButtonTxtBlockUser({ login }: { login: string }) {
  const errorContext = useErrorContext();
  const loginContext = useLoginContext();
  const socketContext = useSocketContext();
  const [blockedList, setBlockedList] = React.useState<[]>([]);

  React.useEffect(() => {
    userService
      .getUserBlockedUsers(loginContext.userLogin)
      .then((blocked: IUserPublicInfos[]) => {
        setBlockedList(blocked);
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, loginContext));
      });

    socketContext.socket.on("update-relations", () => {
      userService
        .getUserBlockedUsers(loginContext.userLogin)
        .then((blocked: IUserPublicInfos[]) => {
          setBlockedList(blocked);
        })
		.catch((error) => {
		  errorContext.newError?.(errorHandler(error, loginContext));
		});
    });
  }, []);

  const handleUnblockOnClick = () => {
    if (loginContext.userLogin !== null && loginContext.userLogin !== login) {
      userService.unblockUser(loginContext.userLogin, login).then(() => {
        socketContext.socket.emit("user:update-relations");
        socketContext.socket.emit("user:update-direct-messages");
        socketContext.socket.emit("user:update-channel-content");
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, loginContext));
      });
    }
  };

  const handleBlockOnClick = () => {
    if (loginContext.userLogin !== null && loginContext.userLogin !== login) {
      userService.blockUser(loginContext.userLogin, login).then(() => {
        socketContext.socket.emit("user:update-relations");
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, loginContext));
      });
    }
  };

  if (
    blockedList?.find((blocked: IUserPublicInfos) => blocked.login42 === login)
  ) {
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
