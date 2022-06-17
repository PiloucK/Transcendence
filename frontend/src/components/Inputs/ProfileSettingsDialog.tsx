import React, { useState } from "react";
import styles from "../../styles/Home.module.css";

import { TextField } from "../Inputs/TextField";

import Switch from "@mui/material/Switch";
import Avatar from "@mui/material/Avatar";
import Image from "next/image";

import { ButtonUpdateChannel } from "../Buttons/ButtonUpdateChannel";
import { IUser } from "../../interfaces/users";

import userService from "../../services/user";
import { useSessionContext } from "../../context/SessionContext";

import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
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
  const sessionContext = useSessionContext();
  const [username, setUsername] = useState(user.username);

  const [textFieldError, setTextFieldError] = useState("");

  const [newImage, setNewImage] = useState<Blob>();
  const [preview, setPreview] = useState("");

  const updateNewImage = (event) => {
    setNewImage(event.target.files[0]);
    setPreview(URL.createObjectURL(event.target.files[0]));
  };

  const Input = styled("input")({
    display: "none",
  });

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
        socket.emit("user:update-username");
      });
      if (newImage !== undefined) {
        const formData = new FormData();
        formData.append("file", newImage);
        userService.updateUserImage(user.login42, formData).then(() => {
          setNewImage(undefined);
          setPreview("");
          socket.emit("user:update-image");
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
            <label htmlFor="icon-button-file">
              <Input
                accept="image/*"
                id="icon-button-file"
                type="file"
                onChange={updateNewImage}
              />
              <Avatar
                src={preview}
                alt="avatar"
                sx={{
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 151,
                  height: 151,
                  cursor: "pointer",
                }}
              >
                <Avatar
                  src={user.image}
                  alt="avatar"
                  sx={{
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 151,
                    height: 151,
                    cursor: "pointer",
                  }}
                >
                  <Avatar
                    src={user.photo42}
                    alt="avatar"
                    sx={{
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 151,
                      height: 151,
                      cursor: "pointer",
                    }}
                  />
                </Avatar>
              </Avatar>
            </label>
          </DialogContent>
          <DialogActions>
            <ButtonUpdateChannel updateChannel={updateUser} />
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
