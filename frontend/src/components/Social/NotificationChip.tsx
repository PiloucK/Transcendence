import React, { useState } from "react";
import styles from "../../styles/Home.module.css";

import { useLoginContext } from "../../context/LoginContext";
import { IUserPublicInfos } from "../../interfaces/IUser";

import Badge from "@mui/material/Badge";

import userService from "../../services/user";

import { errorHandler } from "../../errors/errorHandler";

import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";

export const NotificationChip = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const errorContext = useErrorContext();
  const loginContext = useLoginContext();
  const socketContext = useSocketContext();
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

    socketContext.socket.on("update-relations", () => {
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
