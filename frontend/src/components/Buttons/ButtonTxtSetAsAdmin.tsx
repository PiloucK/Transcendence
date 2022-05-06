import React from "react";

import styles from "../../styles/Home.module.css";

import { IUserPublicInfos, Channel } from "../../interfaces/users";
import userServices from "../../services/users";
import { useLoginContext } from "../../context/LoginContext";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

export function ButtonTxtSetAsAdmin({ login, channel }: { login: string, channel: Channel }) {
  const loginContext = useLoginContext();

  const handleRemoveOnClick = () => {
    if (
      loginContext.userLogin !== null &&
      loginContext.userLogin !== login
    ) {
      // userServices
      //   .unblockUser(loginContext.userLogin, login)
      //   .then(() => {
			// 		socket.emit("user:update-relations");
			// 		socket.emit("user:update-direct-messages");
			// 		socket.emit("user:update-channel-content");
      //   });
			// Unset as admin
    }
  };

  const handleAddOnClick = () => {
    if (
      loginContext.userLogin !== null &&
      loginContext.userLogin !== login
    ) {
      // userServices
      //   .blockUser(loginContext.userLogin, login)
      //   .then(() => {
      //     socket.emit("user:update-relations");
      //   });
			// Set as admin
    }
  };

	if (
		channel.admin.find(
			(admin: string) => admin === login
		)
	) {
		return (
			<div
				className={styles.buttons}
				onClick={handleRemoveOnClick}
			>
				Unset admin
			</div>
		);
	} else {
		return (
			<div
				className={styles.buttons}
				onClick={handleAddOnClick}
			>
				Set as admin
			</div>
		);
	}

}
