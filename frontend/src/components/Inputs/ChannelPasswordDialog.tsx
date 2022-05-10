import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { useLoginContext } from "../../context/LoginContext";
import userService from "../../services/users";
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

export function ChannelPasswordDialog({
  channelId,
  open,
  setOpen,
}: {
  channelId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const loginContext = useLoginContext();
  const [input, setInput] = React.useState("");
  const [error, setError] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setOpen(false);
    userService
      .joinProtectedChannel(loginContext.userLogin, channelId, input)
      .then((channel: Channel) => {
        loginContext.setChatMenu(channel.id);
        socket.emit("user:update-joined-channel");
        socket.emit("user:update-channel-content");
      })
      .catch((err: Error) => {
        setError(true);
      });
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Protected channel</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are trying to join a channel protected with a password. <br />
            Please enter channel’s password to join :
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Channel Password"
            type="password"
            fullWidth
            variant="standard"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Enter</Button>
        </DialogActions>
      </Dialog>
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
          Wrong password.
        </Alert>
      </Snackbar>
    </div>
  );
}