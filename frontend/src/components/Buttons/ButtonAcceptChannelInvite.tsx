import React from "react";
import styles from "../../styles/Home.module.css";

import { useLoginContext } from "../../context/LoginContext";
import channelService from "../../services/channel";

import { Channel } from "../../interfaces/users";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

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
  const loginContext = useLoginContext();
  const [error, setError] = React.useState(false);

  const joinChannel = () => {
    channelService
      .joinChannel(loginContext.userLogin, channelId)
      .then((channel: Channel) => {
        loginContext.setChatMenu?.(channel.id);
        socket.emit("user:update-joined-channel");
        socket.emit("user:update-channel-content");
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
