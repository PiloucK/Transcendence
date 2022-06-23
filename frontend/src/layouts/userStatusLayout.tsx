import React, { useEffect, useRef } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useUserStatusContext } from "../context/UserStatusContext";
import { EmittedLiveStatus, Login42 } from "../interfaces/status.types";
import userStatusService from "../services/userStatus";
import { errorHandler } from "../errors/errorHandler";
import { useErrorContext } from "../context/ErrorContext";
import { useSessionContext } from "../context/SessionContext";

export const UserStatusLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const socketContext = useSocketContext();
  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();
  const userStatusContext = useUserStatusContext();
  const isListeningToStatuses = useRef(false);

  useEffect(() => {
    userStatusService
      .getAll()
      .then((statuses) => {
        userStatusContext.setStatuses?.(new Map(Object.entries(statuses)));
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });

    if (isListeningToStatuses.current !== true) {
      socketContext.socket.on(
        "user:update-status",
        (userLogin42: Login42, userStatus: EmittedLiveStatus) => {
          userStatusContext.handleStatusUpdate?.(userLogin42, userStatus);

          // console.log(
          //   "login",
          //   userLogin42,
          //   "status",
          //   userStatus,
          //   "entry in statuses",
          //   userStatusContext.statuses.get(userLogin42)
          // );
          //     userStatusContext.statuses.set(userLogin42, {
          //       socketCount: -1,
          //       status: userStatus,
          //     });

          //     console.log(
          //       "aeouaoeuaoeuaoeuaoeuaoeuaoeuaoeuaoeu login",
          //       userLogin42,
          //       "status",
          //       userStatus,
          //       "entry in statuses",
          //       userStatusContext.statuses.get(userLogin42)
          //     );
        }
      );
      isListeningToStatuses.current = true;
    }
  }, []);

  return <>{children}</>;
};
