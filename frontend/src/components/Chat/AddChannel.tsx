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

import { ButtonCreateChannel } from "../Buttons/ButtonCreateChannel";
import { Channel, ChannelCreation } from "../../interfaces/users";
import { CardPublicChannel } from "../Cards/CardPublicChannel";

import userService from "../../services/user";
import { useLoginContext } from "../../context/LoginContext";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

function EmptyPublicChannels() {
  return (
    <div className={styles.social_empty_page}>
      <Image src={Ghost} />
      Looks like there is no public channel. You should create yours!
    </div>
  );
}

function PublicChannelsList({ channels }: { channels: Channel[] }) {
  if (typeof channels === "undefined" || channels.length === 0) {
    return <EmptyPublicChannels />;
  }

  return (
    <div className={styles.public_channels_list}>
      {channels.map((channel) =>
        CardPublicChannel({ channelInfos: channel})
      )}
    </div>
  );
}

function PublicChannels() {
  const loginContext = useLoginContext();
  const [channels, setChannels] = useState<Channel[]>([]);

  React.useEffect(() => {
    userService
      .getPublicChannels(loginContext.userLogin)
      .then((channels: Channel[]) => {
        setChannels(channels);
      });

    socket.on("update-public-channels", () => {
    	userService
    		.getPublicChannels(loginContext.userLogin)
    		.then((channels: ChannelCreation[]) => {
    			setChannels(channels);
    		});
    });
  }, []);

  return <PublicChannelsList channels={channels} />;
}

function CreateChannelForm() {
  const loginContext = useLoginContext();
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

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPrivate(event.target.checked);
  };

  const createChannel = () => {
    const channel: ChannelCreation = {
      name: channelName,
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
      userService
        .createChannel(loginContext.userLogin, channel)
        .then((res) => {
					socket.emit("user:update-public-channels");
          socket.emit("user:update-joined-channel");
					loginContext.setChatMenu(res.id);
        });
    }
  };

  return (
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
  );
}

function ButtonBrowse() {
  return <div className={styles.chat_create_channel_browse}>Browse</div>;
}

function CreateChannel() {
  return (
    <div className={styles.chat_create_channel}>
      <div className={styles.chat_create_channel_image}>
        <Image src={channelImage} alt="channel image" />
      </div>
      <ButtonBrowse />
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
