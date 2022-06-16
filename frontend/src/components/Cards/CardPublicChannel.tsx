import React from "react";

import styles from "../../styles/Home.module.css";
import { Channel, ChannelCreation } from "../../interfaces/IUser";

import Avatar from "@mui/material/Avatar";
// import profileIcon from "../../public/profile_icon.png";
import { useSessionContext } from "../../context/SessionContext";
import channelService from "../../services/channel";

import { ChannelPasswordDialog } from "../Inputs/ChannelPasswordDialog";
import { useSocketContext } from "../../context/SocketContext";

export function CardPublicChannel({ channelInfos }: { channelInfos: Channel }) {
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const [open, setOpen] = React.useState(false);

  const joinChannel = () => {
    if (sessionContext.userLogin !== null) {
      if (channelInfos.password !== "") {
        setOpen(true);
      } else {
        channelService
          .joinChannel(sessionContext.userLogin, channelInfos.id)
          .then((channel: Channel) => {
            sessionContext.setChatMenu?.(channel.id);
            socketContext.socket.emit("user:update-joined-channel");
            socketContext.socket.emit("user:update-channel-content");
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
      <ChannelPasswordDialog
        channelId={channelInfos.id}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
}
