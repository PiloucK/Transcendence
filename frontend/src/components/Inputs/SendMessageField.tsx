import React from "react";
import styles from "../../styles/Home.module.css";

import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

import { useLoginContext } from "../../context/LoginContext";

import userService from "../../services/user";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

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
  const loginContext = useLoginContext();
  const [error, setError] = React.useState(false);
  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInput(event.target.value);
  };

  const handleSendMessage = () => {
    if (input.length > 0) {
      if (channel.length === 36) {
        userService
          .sendMSGToChannel(loginContext.userLogin, channel, {
            author: loginContext.userLogin,
            content: input,
          })
          .then(() => {
            socket.emit("user:update-channel-content");
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
          users[0] === loginContext.userLogin ? users[1] : users[0];

        userService
          .sendDM(loginContext.userLogin, otherLogin, {
            author: loginContext.userLogin,
            content: input,
          })
          .then(() => {
            socket.emit("user:update-direct-messages");
            setInput("");
          });
      }
    }
  };

  return (
    <>
      <Input
        onSubmit={handleSendMessage}
        autoFocus={true}
        autoComplete="off"
        disableUnderline={true}
        multiline={true}
        maxRows={4}
        sx={{
          border: "5px solid #E5E5E5",
          top: "86%",
          width: "1002px",
          lineHeight: "27px",
          borderRadius: "20px",
          backgroundColor: "#E5E5E5",
        }}
        id="outlined-adornment-input"
        value={input}
        onChange={handleInputChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="send message"
              edge="end"
              onClick={handleSendMessage}
            >
              <SendIcon />
            </IconButton>
          </InputAdornment>
        }
        label="Text message"
      />
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
