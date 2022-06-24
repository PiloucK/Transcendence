import { createContext, useContext, useState } from "react";
import React from "react";
import { IUserStatusContext } from "../interfaces/IUserStatusContext";
import { defaultUserStatusState } from "../constants/defaultUserStatusState";
import {
  EmittedLiveStatus,
  Login42,
  StatusMetrics,
} from "../interfaces/status.types";

const UserStatusContext = createContext<IUserStatusContext>(
  defaultUserStatusState
);

export const UserStatusProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [statuses, setStatuses] = useState(new Map<Login42, StatusMetrics>());

  const handleStatusUpdate = (
    userLogin42: Login42,
    status: EmittedLiveStatus
  ) => {
    console.log("statuses handletruc", statuses);
    const tmp = statuses.get(userLogin42);
    console.log('tmp =', tmp);
    if (tmp) {
      tmp.status = status;
    }
  };

  return (
    <UserStatusContext.Provider
      value={{
        statuses,
        setStatuses,
        handleStatusUpdate,
      }}
    >
      {children}
    </UserStatusContext.Provider>
  );
};

export function useUserStatusContext() {
  return useContext(UserStatusContext);
}
