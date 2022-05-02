import React from "react";

import styles from "../../styles/Home.module.css";

import { IUserPublicInfos } from "../../interfaces/users";
import userServices from "../../services/users";
import { useLoginContext } from "../../context/LoginContext";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

export function ButtonTxtBlockUser({ login }: { login: string }) {
  const loginContext = useLoginContext();
  const [blockedList, setBlockedList] = React.useState<[]>([]);

	React.useEffect(() => {
    userServices
      .getUserBlocked(loginContext.userLogin)
      .then((blocked: IUserPublicInfos[]) => {
        setBlockedList(blocked);
      });

    socket.on("update-relations", () => {
      userServices
        .getUserBlocked(loginContext.userLogin)
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
      userServices
        .unblockUser(loginContext.userLogin, login)
        .then(() => {
          socket.emit("user:update-relations");
        });
    }
  };

  const handleBlockOnClick = () => {
    if (
      loginContext.userLogin !== null &&
      loginContext.userLogin !== login
    ) {
      userServices
        .blockUser(loginContext.userLogin, login)
        .then(() => {
          socket.emit("user:update-relations");
        });
    }
  };

	if (
		blockedList.find(
			(blocked: IUserPublicInfos) => blocked.login42 === login
		)
	) {
		return (
			<div
				className={styles.chat_direct_message_menu_new}
				onClick={handleUnblockOnClick}
			>
				Unblock
			</div>
		);
	} else {
		return (
			<div
				className={styles.chat_direct_message_menu_new}
				onClick={handleBlockOnClick}
			>
				Block
			</div>
		);
	}

}
