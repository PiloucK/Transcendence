import React from "react";
import styles from "../../styles/Home.module.css";

import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";

import { useLoginContext } from "../../context/LoginContext";

import userServices from "../../services/users";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

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
  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInput(event.target.value);
  };

  const handleSendMessage = () => {
    if (input.length > 0) {
      const users = channel.split("|");
      const otherLogin =
        users[0] === loginContext.userLogin ? users[1] : users[0];

      userServices
        .sendDM(loginContext.userLogin, otherLogin, {
          author: loginContext.userLogin,
          content: input,
        })
        .then(() => {
          socket.emit("user:update-direct-messages");
          setInput("");
        });
    }
  };

  return (
    <Input
      onSubmit={handleSendMessage}
			autoFocus="true"
      autoComplete="off"
			disableUnderline="true"
			multiline="true"
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
  );
}
