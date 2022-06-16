import React from "react";

import styles from "../../styles/Home.module.css";

import { IUserPublicInfos } from "../../interfaces/IUser";
import userService from "../../services/user";
import { useSessionContext } from "../../context/SessionContext";
import { useSocketContext } from "../../context/SocketContext";

export function ButtonTxtBlockUser({ login }: { login: string }) {
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const [blockedList, setBlockedList] = React.useState<[]>([]);

  React.useEffect(() => {
    userService
      .getUserBlockedUsers(sessionContext.userLogin)
      .then((blocked: IUserPublicInfos[]) => {
        setBlockedList(blocked);
      });

    socketContext.socket.on("update-relations", () => {
      userService
        .getUserBlockedUsers(sessionContext.userLogin)
        .then((blocked: IUserPublicInfos[]) => {
          setBlockedList(blocked);
        });
    });
  }, []);

  const handleUnblockOnClick = () => {
    if (sessionContext.userLogin !== null && sessionContext.userLogin !== login) {
      userService.unblockUser(sessionContext.userLogin, login).then(() => {
        socketContext.socket.emit("user:update-relations");
        socketContext.socket.emit("user:update-direct-messages");
        socketContext.socket.emit("user:update-channel-content");
      });
    }
  };

  const handleBlockOnClick = () => {
    if (sessionContext.userLogin !== null && sessionContext.userLogin !== login) {
      userService.blockUser(sessionContext.userLogin, login).then(() => {
        socketContext.socket.emit("user:update-relations");
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
