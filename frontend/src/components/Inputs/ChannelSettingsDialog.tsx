import React, { useState } from "react";
import styles from "../../styles/Home.module.css";

import { TextField } from "../Inputs/TextField";
import { PasswordField } from "../Inputs/PasswordField";
import { inputPFState } from "../../interfaces/inputPasswordField";

import Switch from "@mui/material/Switch";

import { ButtonUpdateChannel } from "../Buttons/ButtonUpdateChannel";
import { Channel, ChannelCreation } from "../../interfaces/users";

import channelService from "../../services/channel";
import { useLoginContext } from "../../context/LoginContext";

import ToggleButton from "@mui/material/ToggleButton";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { errorHandler } from "../../errors/errorHandler";

import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";

export function ChannelSettingsDialog({
  channel,
  open,
  setOpen,
}: {
  channel: Channel;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const errorContext = useErrorContext();
  const loginContext = useLoginContext();
  const socketContext = useSocketContext();
  const [channelName, setChannelName] = useState(channel.name);

  const [setPassword, setSetPassword] = React.useState(false);
  const [height, setHeight] = React.useState("400px");
  const [channelPassword, setChannelPassword] = useState<inputPFState>({
    password: "",
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
      setPassword: setPassword,
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
    if (setPassword === true) {
      if (channelInfos.password !== confirmation.password) {
        setConfirmationFieldError("Passwords do not match.");
        error = true;
      }
    }
    if (error === false) {
      setOpen(false);
      channelService
        .updateChannel(loginContext.userLogin, channel.id, channelInfos)
        .then((res) => {
          socketContext.socket.emit("user:update-public-channels");
          socketContext.socket.emit("user:update-joined-channels");
          socketContext.socket.emit("user:update-channel-content");
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, loginContext));
        });
    }
  };

  const passwordChange = () => {
    if (setPassword === true) {
      return (
        <>
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
        </>
      );
    } else {
      return null;
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
            minHeight: height,
            overflowY: "hidden",
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
          <ToggleButton
            value="check"
            selected={setPassword}
            onChange={() => {
              height === "700px" ? setHeight("400px") : setHeight("700px");
              setSetPassword(!setPassword);
            }}
            sx={{
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {setPassword ? "Keep password" : "Change password"}
          </ToggleButton>
          {passwordChange()}
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
