import React from "react";

import styles from "../../styles/Home.module.css";
import { Channel, ChannelCreation } from "../../interfaces/users";

import Avatar from "@mui/material/Avatar";
// import profileIcon from "../../public/profile_icon.png";
import { useLoginContext } from "../../context/LoginContext";
import userService from "../../services/user";

import { ChannelPasswordDialog } from "../Inputs/ChannelPasswordDialog";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

export function CardPublicChannel({ channelInfos }: { channelInfos: Channel }) {
  const loginContext = useLoginContext();
  const [open, setOpen] = React.useState(false);

  const joinChannel = () => {
    if (loginContext.userLogin !== null) {
      if (channelInfos.password !== "") {
        setOpen(true);
      } else {
        userService
          .joinChannel(loginContext.userLogin, channelInfos.id)
          .then((channel: Channel) => {
            loginContext.setChatMenu(channel.id);
            socket.emit("user:update-joined-channel");
            socket.emit("user:update-channel-content");
          });
      }
    }
  };

  return (
    <div key={channelInfos.id}>
      <div className={styles.channel_card} onClick={joinChannel}>
        {/* Channel Avatar here */}
        <div className={styles.channel_name}>{channelInfos.name}</div>
      </div>
      <ChannelPasswordDialog channelId={channelInfos.id} open={open} setOpen={setOpen} />
    </div>
  );
}
