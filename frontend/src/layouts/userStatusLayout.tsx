import React, { useEffect, useState } from "react";
import { useSessionContext } from "../context/SessionContext";
import { useErrorContext } from "../context/ErrorContext";
import { showOverlayOnEscape } from "../events/showOverlayOnEscape";
import { createContext, useContext } from "react";
import userStatusService from "../services/userStatus";
import { errorHandler } from "../errors/errorHandler";
import { Login42, StatusMetrics } from "../interfaces/status.types";

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
  const [userStatuses, setUserStatuses] = useState(
    new Map<Login42, StatusMetrics>()
  );

  useEffect(() => {
    userStatusService
      .getAll()
      .then((statuses) => {
        console.log("then() in useeffect status layout", statuses);
        setUserStatuses(statuses);
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });
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
