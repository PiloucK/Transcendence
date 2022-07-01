import React, { useState } from "react";
import styles from "../../styles/Home.module.css";

import Image from "next/image";
import channelImage from "../../public/channel_image.png"; //Maybe Temporary.
import Ghost from "../../public/ghost.png";

import { AddChannelMenu } from "./Menus";

import { TextField } from "../Inputs/TextField";
import { PasswordField } from "../Inputs/PasswordField";
import { inputPFState } from "../../interfaces/inputPasswordField";

import Switch from "@mui/material/Switch";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";

import { ButtonCreateChannel } from "../Buttons/ButtonCreateChannel";
import { Channel, ChannelCreation } from "../../interfaces/Chat.interfaces";
import { CardPublicChannel } from "../Cards/CardPublicChannel";

import channelService from "../../services/channel";

import { errorHandler } from "../../errors/errorHandler";

import { useErrorContext } from "../../context/ErrorContext";
import { useSessionContext } from "../../context/SessionContext";
import { useSocketContext } from "../../context/SocketContext";

function EmptyPublicChannels() {
  return (
    <div className={styles.social_empty_page}>
      <Image src={Ghost} />
      Looks like there is no public channel. You should create yours!
    </div>
  );
}

function PublicChannelsList({ channels }: { channels: Channel[] }) {
  const [open, setOpen] = React.useState({state: false, id: ""});

  if (typeof channels === "undefined" || channels.length === 0) {
    return <EmptyPublicChannels />;
  }

  return (
    <div className={styles.public_channels_list}>
      {channels.map((channel) => (
        <CardPublicChannel
          channelInfos={channel}
          open={open}
          setOpen={setOpen}
        />
      ))}
    </div>
  );
}

function PublicChannels() {
  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const [channels, setChannels] = useState<Channel[]>([]);

  React.useEffect(() => {
    channelService
      .getPublicChannels(sessionContext.userSelf.login42)
      .then((channels: Channel[]) => {
        setChannels(channels);
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });

    socketContext.socket.on("update-public-channels", () => {
      channelService
        .getPublicChannels(sessionContext.userSelf.login42)
        .then((channels: Channel[]) => {
          setChannels(channels);
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
        });
    });
  }, []);

  return <PublicChannelsList channels={channels} />;
}

function CreateChannelForm() {
  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const [channelName, setChannelName] = useState("");
  const [channelPassword, setChannelPassword] = useState<inputPFState>({
    password: "",
    showPassword: false,
  });
  const [confirmation, setConfirmation] = useState<inputPFState>({
    password: "",
    showPassword: false,
  });
  const [isPrivate, setIsPrivate] = useState(false);

  const [textFieldError, setTextFieldError] = useState("");
  const [confirmationFieldError, setConfirmationFieldError] = useState("");

  const [newImage, setNewImage] = useState<Blob>();
  const [preview, setPreview] = useState("");

  const updateNewImage = (event) => {
    setNewImage(event.target.files[0]);
    setPreview(URL.createObjectURL(event.target.files[0]));
  };

  const Input = styled("input")({
    display: "none",
  });

  const buttonBrowse = () => {
    return (
      <label htmlFor="icon-button-file">
        <Input
          accept="image/*"
          id="icon-button-file"
          type="file"
          onChange={updateNewImage}
        />
        <div className={styles.chat_create_channel_browse}>Browse</div>
      </label>
    );
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPrivate(event.target.checked);
  };

  const createChannel = () => {
    const channel: ChannelCreation = {
      name: channelName,
      setPassword: true,
      password: channelPassword.password,
      isPrivate: isPrivate,
    };
    let error = false; // Needed due to to async nature of the useState.
    setTextFieldError("");
    setConfirmationFieldError("");
    if (channel.name === "") {
      setTextFieldError("Channel name is required.");
      error = true;
    }
    if (channel.password !== confirmation.password) {
      setConfirmationFieldError("Passwords do not match.");
      error = true;
    }
    if (error === false) {
      channelService
        .createChannel(sessionContext.userSelf.login42, channel)
        .then((res) => {
          socketContext.socket.emit("user:update-public-channels");
          socketContext.socket.emit("user:update-joined-channels");
          sessionContext.setChatMenu?.(res.id);
          if (newImage !== undefined) {
            const formData = new FormData();
            formData.append("file", newImage);
            channelService
              .updateChannelImage(
                sessionContext.userSelf.login42,
                res.id,
                formData
              )
              .then((res) => {
                socketContext.socket.emit("user:update-public-channels");
                socketContext.socket.emit("user:update-joined-channels");
              })
              .catch((error) => {
                errorContext.newError?.(errorHandler(error, sessionContext));
              });
          }
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
        });
    }
  };

  return (
    <>
      <div className={styles.chat_create_channel_image}>
        <Avatar
          src={preview}
          alt="channel image"
          sx={{
            width: 250,
            height: 250,
          }}
        >
          <Image
            src={channelImage}
            alt="channel image"
            width="250"
            height="250"
          />
        </Avatar>
      </div>
      {buttonBrowse()}
      <div className={styles.chat_create_channel_form}>
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
        <div className={styles.chat_create_channel_form_switch}>
          Set channel as private{" "}
          <Switch checked={isPrivate} onChange={handleSwitchChange} />
        </div>
        <ButtonCreateChannel createChannel={createChannel} />
      </div>
    </>
  );
}

function CreateChannel() {
  return (
    <div className={styles.chat_create_channel}>
      <CreateChannelForm />
    </div>
  );
}

function AddChannelContent({ menu }: { menu: string }) {
  if (menu === "public_channels") {
    return <PublicChannels />;
  }
  return <CreateChannel />;
}

export function AddChannel() {
  const [menu, setMenu] = useState("public_channels");

  return (
    <div className={styles.chat_add_channel}>
      <AddChannelMenu menu={menu} setMenu={setMenu} />
      <AddChannelContent menu={menu} />
    </div>
  );
}
