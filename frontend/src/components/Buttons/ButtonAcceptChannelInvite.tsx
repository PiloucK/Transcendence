import React from "react";
import styles from "../../styles/Home.module.css";

import { useSessionContext } from "../../context/SessionContext";
import channelService from "../../services/channel";

import { Channel } from "../../interfaces/IUser";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useSocketContext } from "../../context/SocketContext";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function ButtonAcceptChannelInvite({
  channelId,
}: {
  channelId: string;
}) {
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const [error, setError] = React.useState(false);

  const joinChannel = () => {
    channelService
      .joinChannel(sessionContext.userLogin, channelId)
      .then((channel: Channel) => {
        sessionContext.setChatMenu?.(channel.id);
        socketContext.socket.emit("user:update-joined-channel");
        socketContext.socket.emit("user:update-channel-content");
      })
      .catch((err) => {
        if (err.response.status === 403) {
          setError(true);
        }
      });
  };

  return (
    <>
      <div
        className={styles.channel_accept_invitation_button}
        onClick={joinChannel}
      >
        Join
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={error}
        autoHideDuration={6000}
        onClose={() => {
          setError(false);
        }}
      >
        <Alert
          onClose={() => {
            setError(false);
          }}
          severity="error"
          sx={{ width: "100%" }}
        >
          You are not allowed to join this channel.
        </Alert>
      </Snackbar>
    </>
  );
}
