import React from "react";

import styles from "../../styles/Home.module.css";

import { IUserPublicInfos } from "../../interfaces/users";
import userService from "../../services/user";
import { useLoginContext } from "../../context/LoginContext";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

export function ButtonTxtBlockUser({ login }: { login: string }) {
  const loginContext = useLoginContext();
  const [blockedList, setBlockedList] = React.useState<[]>([]);

	React.useEffect(() => {
    userService
      .getUserBlockedUsers(loginContext.userLogin)
      .then((blocked: IUserPublicInfos[]) => {
        setBlockedList(blocked);
      });

    socket.on("update-relations", () => {
      userService
        .getUserBlockedUsers(loginContext.userLogin)
        .then((blocked: IUserPublicInfos[]) => {
          setBlockedList(blocked);
        });
    });
  }, []);

  const handleUnblockOnClick = () => {
    if (
      loginContext.userLogin !== null &&
      loginContext.userLogin !== login
    ) {
      userService
        .unblockUser(loginContext.userLogin, login)
        .then(() => {
					socket.emit("user:update-relations");
					socket.emit("user:update-direct-messages");
					socket.emit("user:update-channel-content");
        });
    }
  };

  const handleBlockOnClick = () => {
    if (
      loginContext.userLogin !== null &&
      loginContext.userLogin !== login
    ) {
      userService
        .blockUser(loginContext.userLogin, login)
        .then(() => {
          socket.emit("user:update-relations");
        });
    }
  };

	if (
		blockedList?.find(
			(blocked: IUserPublicInfos) => blocked.login42 === login
		)
	) {
		return (
			<div
				className={styles.buttons}
				onClick={handleUnblockOnClick}
			>
				Unblock
			</div>
		);
	} else {
		return (
			<div
				className={styles.buttons}
				onClick={handleBlockOnClick}
			>
				Block
			</div>
		);
	}

}
