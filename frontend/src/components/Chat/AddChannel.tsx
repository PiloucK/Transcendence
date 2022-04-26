import React from "react";
import styles from "../../styles/Home.module.css";

import Image from "next/image";
import channelImage from "../../public/channel_image.png"; //Maybe Temporary.
import Ghost from "../../public/ghost.png";

import { AddChannelMenu } from "./Menus";

import { TextField } from "../Inputs/TextField";
import { PasswordField } from "../Inputs/PasswordField";
import { inputPFState } from "../../interfaces/inputPasswordField";

import Switch from "@mui/material/Switch";

function EmptyPublicChannels() {
  return (
    <div className={styles.social_empty_page}>
      <Image src={Ghost} />
      Looks like there is no public channel. You should create yours!
    </div>
  );
}

function PublicChannels() {
  return <EmptyPublicChannels />;
}
function CreateChannelForm() {
  const [channelName, setChannelName] = React.useState("");
  const [channelPassword, setChannelPassword] = React.useState<inputPFState>({
    amount: "",
    password: "",
    weight: "",
    weightRange: "",
    showPassword: false,
  });
  const [confirmation, setConfirmation] = React.useState<inputPFState>({
    amount: "",
    password: "",
    weight: "",
    weightRange: "",
    showPassword: false,
  });
  const [isPrivate, setIsPrivate] = React.useState(false);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPrivate(event.target.checked);
  };

  return (
    <div className={styles.chat_create_channel_form}>
      <div className={styles.chat_create_channel_form_input}>
        Channel Name
        <TextField value={channelName} setValue={setChannelName} />
      </div>
      <div className={styles.chat_create_channel_form_input}>
        Channel Password
        <PasswordField
          password={channelPassword}
          setPassword={setChannelPassword}
        />
      </div>
      <div className={styles.chat_create_channel_form_input}>
        Confirm Password
        <PasswordField password={confirmation} setPassword={setConfirmation} />
      </div>
      <div className={styles.chat_create_channel_form_switch}>
        Set channel as private{" "}
        <Switch checked={isPrivate} onChange={handleSwitchChange} />
      </div>
      <div className={styles.chat_create_channel_form_create}>Create</div>
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
  } else if (menu === "create_channel") {
    return <CreateChannel />;
  } else {
    return null;
  }
}

export function AddChannel() {
  const [menu, setMenu] = React.useState("public_channels");

  return (
    <div className={styles.chat_add_channel}>
      <AddChannelMenu menu={menu} setMenu={setMenu} />
      <AddChannelContent menu={menu} />
    </div>
  );
}
