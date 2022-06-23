import { useEffect } from "react";
import { useSessionContext } from "../../context/SessionContext";
import Badge from "@mui/material/Badge";
import { useSocketContext } from "../../context/SocketContext";

export const NotificationChip = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();

  useEffect(() => {
    socketContext.socket.on("update-relations", () => {
      sessionContext.updateUserSelf?.();
    });
  }, []);

  const requests = sessionContext.userSelf.friendRequestsReceived?.filter(
    (notification) =>
      !sessionContext.userSelf.blockedUsers?.some(
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
