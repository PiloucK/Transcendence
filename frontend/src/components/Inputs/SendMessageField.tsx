import React from "react";
import styles from "../../styles/Home.module.css";

import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

import { useSessionContext } from "../../context/SessionContext";

import channelService from "../../services/channel";
import privateConvService from "../../services/privateConv";

import { errorHandler } from "../../errors/errorHandler";

import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function SendMessageField({
  input,
  setInput,
  channel,
}: {
  input: string;
  setInput: (input: string) => void;
  channel: string;
}) {
  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const [error, setError] = React.useState(false);
  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInput(event.target.value);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (input.length > 0) {
      if (channel.length === 36) {
        channelService
          .sendMSGToChannel(sessionContext.userSelf.login42, channel, {
            author: sessionContext.userSelf.login42,
            content: input,
          })
          .then(() => {
            socketContext.socket.emit("user:update-channel-content");
            setInput("");
          })
          .catch((err) => {
            if (err.response.status === 403) {
              setError(true);
            }
          });
      } else {
        const users = channel.split("|");
        const otherLogin =
          users[0] === sessionContext.userSelf.login42 ? users[1] : users[0];

        privateConvService
          .sendPrivateMessage(sessionContext.userSelf.login42, otherLogin, {
            author: sessionContext.userSelf.login42,
            content: input,
          })
          .then(() => {
            socketContext.socket.emit("user:update-direct-messages");
            setInput("");
          })
          .catch((error) => {
            errorContext.newError?.(errorHandler(error, sessionContext));
          });
      }
    }
  };

  return (
    <>
      <FormControl
        onSubmit={handleSendMessage}
        sx={{
          border: "5px solid #E5E5E5",
          top: "86%",
          width: "1002px",
          lineHeight: "27px",
          borderRadius: "20px",
          backgroundColor: "#E5E5E5",
        }}
        component="form"
      >
        <Input
          autoFocus={true}
          autoComplete="off"
          disableUnderline={true}
          id="outlined-adornment-input"
          value={input}
          onChange={handleInputChange}
          label="Text message"
          endAdornment={
            <InputAdornment position="end" type="submit">
              <IconButton type="submit" aria-label="send message">
                <SendIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
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
          You are not allowed to send messages to this channel.
        </Alert>
      </Snackbar>
    </>
  );
}
