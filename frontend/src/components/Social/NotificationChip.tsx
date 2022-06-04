import React, { useState } from "react";
import styles from "../../styles/Home.module.css";

import { useLoginContext } from "../../context/LoginContext";
import { IUserPublicInfos } from "../../interfaces/users";

import Badge from "@mui/material/Badge";

import userService from "../../services/user";

import io from "socket.io-client";

import { errorHandler } from "../../errors/errorHandler";

import getConfig from "next/config";
import { useErrorContext } from "../../context/ErrorContext";
const { publicRuntimeConfig } = getConfig();
const socket = io(
  `http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.WEBSOCKETS_PORT}`,
  { transports: ["websocket"] }
);

export const NotificationChip = ({ children }: React.ReactNode) => {
  const errorContext = useErrorContext();
  const loginContext = useLoginContext();
  const [notifications, setNotifications] = useState<IUserPublicInfos[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<IUserPublicInfos[]>([]);

  React.useEffect(() => {
    userService
      .getUserFriendRequestsReceived(loginContext.userLogin)
      .then((notifications: IUserPublicInfos[]) => {
        setNotifications(notifications);
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, loginContext));
      });
    userService
      .getUserBlockedUsers(loginContext.userLogin)
      .then((blocked: IUserPublicInfos[]) => {
        setBlockedUsers(blocked);
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, loginContext));
      });

    socket.on("update-relations", () => {
      userService
        .getUserFriendRequestsReceived(loginContext.userLogin)
        .then((notifications: IUserPublicInfos[]) => {
          setNotifications(notifications);
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, loginContext));
        });
      userService
        .getUserBlockedUsers(loginContext.userLogin)
        .then((blocked: IUserPublicInfos[]) => {
          setBlockedUsers(blocked);
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, loginContext));
        });
    });
  }, []);

  const requests = notifications?.filter(
    (notification) =>
      !blockedUsers?.some(
        (blockedUser) => blockedUser.login42 === notification.login42
      )
  );

  if (typeof requests === "undefined") {
    return children;
  }
  return (
    <Badge badgeContent={requests.length} color="primary">
      {children}
    </Badge>
  );
};
