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
import { Channel } from "../../interfaces/Chat.interfaces";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

import { errorHandler } from "../../errors/errorHandler";

import { useErrorContext } from "../../context/ErrorContext";
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
  open: { state: boolean; id: string };
  setOpen: (open: { state: boolean; id: string }) => void;
}) {
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const [input, setInput] = React.useState("");
  const [textFieldError, setTextFieldError] = React.useState("");

  const handleClose = () => {
    setOpen({ state: false, id: "" });
  };

  const handleSubmit = () => {
    channelService
      .joinProtectedChannel(sessionContext.userSelf.login42, channelId, input)
      .then((channel: Channel) => {
        setOpen({ state: false, id: "" });
        sessionContext.setChatMenu?.(channel.id);
        socketContext.socket.emit("user:update-joined-channels");
        socketContext.socket.emit("user:update-channel-content");
      })
      .catch((error) => {
        setTextFieldError("Wrong password.");
      });
  };
  return (
    <div>
      <Dialog
        PaperProps={{
          style: {
            backgroundColor: "#163F5B",
          },
        }}
        open={open.state}
        onClose={handleClose}
      >
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
            helperText={textFieldError}
            error={textFieldError !== ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Enter</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
