import React, { useEffect, useRef, useState } from "react";
import { useSessionContext } from "../context/SessionContext";
import { useErrorContext } from "../context/ErrorContext";
import { showOverlayOnEscape } from "../events/showOverlayOnEscape";
import { createContext, useContext } from "react";
import userStatusService from "../services/userStatus";
import { errorHandler } from "../errors/errorHandler";
import {
  EmittedLiveStatus,
  Login42,
  StatusMetrics,
} from "../interfaces/status.types";
import { useSocketContext } from "../context/SocketContext";

const UserStatusContext = createContext<any>(new Map<Login42, StatusMetrics>());

export const UserStatusLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const sessionContext = useSessionContext();
  const errorContext = useErrorContext();
  const socketContext = useSocketContext();
  const [userStatuses, setUserStatuses] = useState(
    new Map<Login42, StatusMetrics>()
  );
  const isListeningToStatuses = useRef(false);

  useEffect(() => {
    userStatusService
      .getAll()
      .then((statuses) => {
        setUserStatuses(new Map(Object.entries(statuses)));
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });
    if (isListeningToStatuses.current !== true) {
      socketContext.socket.on(
        "user:update-status",
        (userLogin42: Login42, userStatus: EmittedLiveStatus) => {
          console.log(userStatuses);

          const tmp = userStatuses.get(userLogin42);
          if (tmp) {
            tmp.status = userStatus;
          }
        }
      );
      isListeningToStatuses.current = true;
    }
  }, []);

  const [showOverlay, setShowOverlay] = useState(false);

  showOverlayOnEscape(showOverlay, setShowOverlay);

  return (
    <UserStatusContext.Provider value={userStatuses}>
      {children}
    </UserStatusContext.Provider>
  );
};

export function useUserStatusContext() {
  return useContext(UserStatusContext);
}
