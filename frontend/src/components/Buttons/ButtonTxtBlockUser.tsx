import { useEffect, useRef, useState } from "react";

import styles from "../../styles/Home.module.css";

import { IUserPublicInfos } from "../../interfaces/users";
import userService from "../../services/user";
import { useLoginContext } from "../../context/LoginContext";
import { useSocketContext } from "../../context/SocketContext";

export function ButtonTxtBlockUser({ login }: { login: string }) {
  const loginContext = useLoginContext();
  const socketContext = useSocketContext();
  const [blockedList, setBlockedList] = useState<IUserPublicInfos[]>([]);
  const mountedOnce = useRef(false);

  const handleMount = async () => {
    let blocked: IUserPublicInfos[];

    blocked = await userService.getUserBlockedUsers(loginContext.userLogin);
    setBlockedList(blocked);

    socketContext.socket.on("update-relations", async () => {
      blocked = await userService.getUserBlockedUsers(loginContext.userLogin);
      setBlockedList(blocked);
    });
  };

  useEffect(() => {
    if (mountedOnce.current !== true) {
      handleMount;
      mountedOnce.current = true;
    }
  }, []);

  const handleUnblockOnClick = async () => {
    if (loginContext.userLogin !== null && loginContext.userLogin !== login) {
      await userService.unblockUser(loginContext.userLogin, login);

      socketContext.socket.emit("user:update-relations");
      socketContext.socket.emit("user:update-direct-messages");
      socketContext.socket.emit("user:update-channel-content");
    }
  };

  const handleBlockOnClick = async () => {
    if (loginContext.userLogin !== null && loginContext.userLogin !== login) {
      await userService.blockUser(loginContext.userLogin, login);

      socketContext.socket.emit("user:update-relations");
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
