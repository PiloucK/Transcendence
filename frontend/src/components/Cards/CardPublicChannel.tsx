import React from "react";

import styles from "../../styles/Home.module.css";
import { Channel } from "../../interfaces/users";

// import profileIcon from "../../public/profile_icon.png";
import { useLoginContext } from "../../context/LoginContext";
import channelService from "../../services/channel";

import { ChannelPasswordDialog } from "../Inputs/ChannelPasswordDialog";
import { useSocketContext } from "../../context/SocketContext";

export function CardPublicChannel({ channelInfos }: { channelInfos: Channel }) {
  const loginContext = useLoginContext();
  const socketContext = useSocketContext();
  const [open, setOpen] = React.useState(false);

  const joinChannel = async () => {
    if (loginContext.userLogin !== null) {
      if (channelInfos.password !== "") {
        setOpen(true);
      } else {
        const channel: Channel = await channelService.joinChannel(
          loginContext.userLogin,
          channelInfos.id
        );
        loginContext.setChatMenu?.(channel.id);
        socketContext.socket.emit("user:update-joined-channel");
        socketContext.socket.emit("user:update-channel-content");
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
