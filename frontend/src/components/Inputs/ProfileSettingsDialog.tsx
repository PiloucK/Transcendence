import React, { useState } from "react";
import styles from "./ProfileSettingsDialog.module.css";

import { TextField } from "../Inputs/TextField";

import { ButtonUpdateProfileSettings } from "../Buttons/ButtonUpdateProfileSettings";

import userService from "../../services/user";
import { errorHandler } from "../../errors/errorHandler";
import { useErrorContext } from "../../context/ErrorContext";

import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { IUserSelf } from "../../interfaces/IUser";
import { useSessionContext } from "../../context/SessionContext";
import { TwoFactorAuth } from "../TwoFactorAuthSettings/TwoFactorAuth";
import { SettingsAvatar } from "./SettingsAvatarDialog";
import { AxiosError } from "axios";
import { HttpStatusCodes } from "../../constants/httpStatusCodes";
import { Box } from "@mui/material";
import { useSocketContext } from "../../context/SocketContext";

export function ProfileSettingsDialog({
  user,
  open,
  setOpen,
}: {
  user: IUserSelf;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const [username, setUsername] = useState(user.username);

  const [textFieldError, setTextFieldError] = useState("");

  const [newImage, setNewImage] = useState<Blob>();
  const [preview, setPreview] = useState("");

  const [maxWidth, setMaxWidth] = React.useState<DialogProps["maxWidth"]>("sm");
  const [alreadySet, setAlreadySet] = useState(false);

  const handleClose = () => {
    setAlreadySet(false);
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
      if (username !== user.username) {
        userService
          .updateUserUsername(user.login42, username)
          .then(() => {
            sessionContext.updateUserSelf?.(); //! Can be done only once
            socketContext.socket.emit("user:update-username");
            setOpen(false);
          })
          .catch((caughtError: Error | AxiosError) => {
            const parsedError = errorHandler(caughtError, sessionContext);
            if (
              parsedError.statusCode === HttpStatusCodes.CONFLICT &&
              parsedError.message.startsWith(
                "duplicate key value violates unique constraint"
              )
            ) {
              setTextFieldError("Username already taken.");
              error = true;
            } else {
              errorContext.newError?.(parsedError);
            }
          });
      }
      if (newImage !== undefined) {
        const formData = new FormData();
        formData.append("file", newImage);
        userService
          .updateUserImage(user.login42, formData)
          .then(() => {
            setNewImage(undefined);
            setPreview("");
            sessionContext.updateUserSelf?.(); //! Can be done only once
            setOpen(false);
          })
          .catch((error) => {
            errorContext.newError?.(errorHandler(error, sessionContext));
          });
      }
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
      <Dialog
        PaperProps={{ style: { backgroundColor: "#163F5B" } }}
        open={open}
        onClose={handleClose}
        maxWidth={maxWidth}
      >
        <DialogTitle>User settings</DialogTitle>
        <DialogContent>
          <Box className={styles.globalSettings}>
            <div className={styles.chat_create_channel_form_input}>
              Username
            </div>
            <TextField
              label=""
              value={username}
              setValue={setUsername}
              error={textFieldError}
            />
            <SettingsAvatar
              preview={preview}
              setNewImage={setNewImage}
              setPreview={setPreview}
              user={user}
            />
            <DialogActions>
              <ButtonUpdateProfileSettings updateChannel={updateUser} />
            </DialogActions>
            <TwoFactorAuth />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
