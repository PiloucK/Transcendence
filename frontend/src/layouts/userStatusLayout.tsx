import React, { useEffect, useRef } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useUserStatusContext } from "../context/UserStatusContext";
import { EmittedLiveStatus, Login42 } from "../interfaces/status.types";
import userStatusService from "../services/userStatus";
import { errorHandler } from "../errors/errorHandler";
import { useErrorContext } from "../context/ErrorContext";
import { useSessionContext } from "../context/SessionContext";
import { useRouter } from "next/router";
import { defaultSessionState } from "../constants/defaultSessionState";

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
  const router = useRouter();

  useEffect(() => {
    if (sessionContext.userSelf != defaultSessionState.userSelf) {
      userStatusService
        .getAll()
        .then((statuses) => {
          userStatusContext.setStatuses?.(new Map(Object.entries(statuses)));

          if (isListeningToStatuses.current !== true) {
            socketContext.socket.on(
              "user:update-status",
              (
                userLogin42: Login42,
                userStatus: EmittedLiveStatus,
                opponentLogin42: Login42 | undefined
              ) => {
                userStatusContext.setStatuses?.(
                  new Map(
                    userStatusContext.statuses.set(userLogin42, {
                      socketCount: -1,
                      status: userStatus,
                      opponentLogin42,
                    })
                  )
                );
                if (
                  opponentLogin42 &&
                  userLogin42 === sessionContext.userSelf.login42
                ) {
                  router.push({
                    pathname: "/player-vs-player",
                    query: { userLogin42, opponentLogin42 },
                  });
                }
              }
            );

            isListeningToStatuses.current = true;
          }
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
        });
    }
  }, [sessionContext]);

  return <>{children}</>;
};
