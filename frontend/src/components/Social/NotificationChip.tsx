import React, { useState } from "react";
import styles from "../../styles/Home.module.css";

import { useLoginContext } from "../../context/LoginContext";
import { IUserPublicInfos } from "../../interfaces/users";
import userService from "../../services/users";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

export function NotificationChip() {
	const loginContext = useLoginContext();
	const [notifications, setNotifications] = useState<IUserPublicInfos[]>([]);

  React.useEffect(() => {

    userService
      .getUserFriendRequestsReceived(loginContext.userLogin)
      .then((notifications: IUserPublicInfos[]) => {
        setNotifications(notifications);
      });

    socket.on("update-relations", () => {
      userService
        .getUserFriendRequestsReceived(loginContext.userLogin)
        .then((notifications: IUserPublicInfos[]) => {
          setNotifications(notifications);
        });
    });
  }, []);

	if (notifications.length === 0) {
		return null;
	}
	return (
		<div className={styles.notification_chip}>
			{notifications.length}
		</div>
	);
}