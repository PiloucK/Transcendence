import React, { useState } from "react";
import styles from "../../styles/Home.module.css";

import { TextField } from "../Inputs/TextField";
import { PasswordField } from "../Inputs/PasswordField";
import { inputPFState } from "../../interfaces/inputPasswordField";

import Switch from "@mui/material/Switch";

import { ButtonUpdateChannel } from "../Buttons/ButtonUpdateChannel";
import { Channel, ChannelCreation } from "../../interfaces/users";

import userServices from "../../services/users";
import { useLoginContext } from "../../context/LoginContext";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

export function ChannelSettingsDialog({
  channel,
  open,
  setOpen,
}: {
  channel: Channel;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const loginContext = useLoginContext();
  const [channelName, setChannelName] = useState(channel.name);
  const [channelPassword, setChannelPassword] = useState<inputPFState>({
    password: channel.password,
    showPassword: false,
  });
  const [confirmation, setConfirmation] = useState<inputPFState>({
    password: "",
    showPassword: false,
  });
  const [isPrivate, setIsPrivate] = useState(channel.isPrivate);

  const [textFieldError, setTextFieldError] = useState("");
  const [confirmationFieldError, setConfirmationFieldError] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPrivate(event.target.checked);
  };

  const updateChannel = () => {
    const channelInfos: ChannelCreation = {
      name: channelName,
      password: channelPassword.password,
      isPrivate: isPrivate,
    };
    let error = false; // Needed due to to async nature of the useState.
    setTextFieldError("");
    setConfirmationFieldError("");
    if (channelInfos.name === "") {
      setTextFieldError("Channel name is required.");
      error = true;
    }
    if (channelInfos.password !== confirmation.password) {
      setConfirmationFieldError("Passwords do not match.");
      error = true;
    }
    if (error === false) {
			setOpen(false);
      userServices
        .updateChannel(loginContext.userLogin, channel.id, channelInfos)
        .then((res) => {
          socket.emit("user:update-public-channels");
          socket.emit("user:update-joined-channel");
        });
    }
  };

  return (
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
        <DialogTitle>Channel settings</DialogTitle>
        <DialogContent>
          <div className={styles.chat_create_channel_form_input}>
            Channel Name
            <TextField
              value={channelName}
              setValue={setChannelName}
              error={textFieldError}
            />
          </div>
          <div className={styles.chat_create_channel_form_input}>
            Channel Password
            <PasswordField
              password={channelPassword}
              setPassword={setChannelPassword}
              id="channelPasswordField"
              error=""
            />
          </div>
          <div className={styles.chat_create_channel_form_input}>
            Confirm Password
            <PasswordField
              password={confirmation}
              setPassword={setConfirmation}
              id="channelPasswordConfirmationField"
              error={confirmationFieldError}
            />
          </div>
          <div className={styles.channel_settings_switch}>
            Set channel as private{" "}
            <Switch checked={isPrivate} onChange={handleSwitchChange} />
          </div>
        </DialogContent>
				<DialogActions>
          <ButtonUpdateChannel updateChannel={updateChannel} />
				</DialogActions>
      </Dialog>
    </div>
  );
}
