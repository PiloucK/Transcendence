import React, { useEffect, useState } from "react";
import { useSessionContext } from "../context/SessionContext";
import { useErrorContext } from "../context/ErrorContext";
import { useSocketContext } from "../context/SocketContext";
import { showOverlayOnEscape } from "../events/showOverlayOnEscape";
import { createContext, useContext } from "react";
import userStatusService from "../services/userStatus";
import { errorHandler } from "../errors/errorHandler";

export type StoredLiveStatus = "ONLINE" | "IN_GAME" | "IN_QUEUE";

interface StatusMetrics {
  socketCount: number;
  status: StoredLiveStatus;
}

type Login42 = string;

const UserStatusContext = createContext<Map<Login42, StatusMetrics>>(
  new Map<Login42, StatusMetrics>()
);

export const UserStatusLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const sessionContext = useSessionContext();
  const errorContext = useErrorContext();
  // const socketContext = useSocketContext();
  const [userStatuses, setUserStatuses] = useState(
    new Map<Login42, StatusMetrics>()
  );

  useEffect(() => {
    userStatusService
      .getAll()
      .then((statuses) => {
        setUserStatuses(statuses);
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });
  }, []);

  const [showOverlay, setShowOverlay] = useState(false);

  showOverlayOnEscape(showOverlay, setShowOverlay);

  // have to always show children and overlay if the is activated !! lags come from rerendering all components in the page
  return (
    <UserStatusContext.Provider value={userStatuses}>
      {children}
    </UserStatusContext.Provider>
  );
};
