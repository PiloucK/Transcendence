import React, { useState } from "react";
import styles from "../../styles/Home.module.css";

import { TextField } from "../Inputs/TextField";

import Switch from "@mui/material/Switch";

import { ButtonUpdateChannel } from "../Buttons/ButtonUpdateChannel";
import { IUser } from "../../interfaces/users";

import userService from "../../services/user";
import { useLoginContext } from "../../context/LoginContext";

import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

export function ProfileSettingsDialog({
  user,
  open,
  setOpen,
}: {
  user: IUser;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const loginContext = useLoginContext();
  const [username, setUsername] = useState(user.username);

  const [textFieldError, setTextFieldError] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const updateUser = () => {
    let error = false;
    setTextFieldError("");
    if (username === "") {
      setTextFieldError("Username cannot be empty.");
      error = true;
    }
    if (error === false) {
      setOpen(false);
      userService.updateUserUsername(user.login42, username).then(() => {
        setUsername("");
        socket.emit("user:update-username");
      });
    }
  };

  return (
    <>
      <IconButton size="large" onClick={() => setOpen(true)}>
        <SettingsIcon
          style={{
            color: "#ffffff",
          }}
          fontSize="large"
        />
      </IconButton>
      <div className={styles.channel_settings}>
        <Dialog
          PaperProps={{
            style: {
              backgroundColor: "#163F5B",
              width: "779px",
              minWidth: "779px",
              height: "657px",
              minHeight: "657px",
            },
          }}
          open={open}
          onClose={handleClose}
        >
          <DialogTitle>User settings</DialogTitle>
          <DialogContent>
            <div className={styles.chat_create_channel_form_input}>
              Username
              <TextField
                value={username}
                setValue={setUsername}
                error={textFieldError}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <ButtonUpdateChannel updateChannel={updateUser} />
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
