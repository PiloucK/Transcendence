import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

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

export function ChannelPasswordDialog({
  channelId,
  open,
  setOpen,
}: {
  channelId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const [input, setInput] = React.useState("");
  const [error, setError] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setOpen(false);
    channelService
      .joinProtectedChannel(sessionContext.userLogin, channelId, input)
      .then((channel: Channel) => {
        sessionContext.setChatMenu?.(channel.id);
        socketContext.socket.emit("user:update-joined-channel");
        socketContext.socket.emit("user:update-channel-content");
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
