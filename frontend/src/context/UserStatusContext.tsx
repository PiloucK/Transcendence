import { createContext, useContext, useState } from "react";
import React from "react";
import { IUserStatusContext } from "../interfaces/IUserStatusContext";
import { defaultUserStatusState } from "../constants/defaultUserStatusState";
import { Login42, StatusMetrics } from "../interfaces/status.types";

const UserStatusContext = createContext<IUserStatusContext>(
  defaultUserStatusState
);

export const UserStatusProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [statuses, setStatuses] = useState(new Map<Login42, StatusMetrics>());

  return (
    <UserStatusContext.Provider
      value={{
        statuses,
        setStatuses,
      }}
    >
      {children}
    </UserStatusContext.Provider>
  );
};

export function useUserStatusContext() {
  return useContext(UserStatusContext);
}
