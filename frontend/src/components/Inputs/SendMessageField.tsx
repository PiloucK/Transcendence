import React from "react";
import styles from "../../styles/Home.module.css";

import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";

import { useLoginContext } from "../../context/LoginContext";

import userServices from "../../services/users";

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
          setInput("");
        });
    }
  };

  return (
    <FormControl
      sx={{
        top: "90%",
        width: "1002px",
        // height: "42px",
        borderRadius: "20px",
        backgroundColor: "#E5E5E5",
      }}
      variant="outlined"
    >
      <OutlinedInput
        id="outlined-adornment-input"
        value={input}
        onChange={handleInputChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle input visibility"
              edge="end"
              onClick={handleSendMessage}
            >
              <SendIcon />
            </IconButton>
          </InputAdornment>
        }
        label="Text message"
      />
    </FormControl>
  );
}
