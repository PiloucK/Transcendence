import React from "react";

import styles from "../../styles/Home.module.css";
import { Channel, ChannelCreation } from "../../interfaces/users";

import Image from "next/image";
import Avatar from "@mui/material/Avatar";
import channelImage from "../../public/channel_image.png";
import { useLoginContext } from "../../context/LoginContext";
import channelService from "../../services/channel";

import { ChannelPasswordDialog } from "../Inputs/ChannelPasswordDialog";

import { errorHandler } from "../../errors/errorHandler";

import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";

export function CardPublicChannel({ channelInfos }: { channelInfos: Channel }) {
  const errorContext = useErrorContext();
  const loginContext = useLoginContext();
  const socketContext = useSocketContext();
  const [open, setOpen] = React.useState(false);

  const joinChannel = () => {
    if (loginContext.userLogin !== null) {
      if (channelInfos.password !== "") {
        setOpen(true);
      } else {
        channelService
          .joinChannel(loginContext.userLogin, channelInfos.id)
          .then((channel: Channel) => {
            loginContext.setChatMenu?.(channel.id);
            socketContext.socket.emit("user:update-joined-channels");
            socketContext.socket.emit("user:update-channel-content");
          })
          .catch((error) => {
            errorContext.newError?.(errorHandler(error, loginContext));
          });
      }
    }
  };

  return (
    <div key={channelInfos.id}>
      <div className={styles.channel_card} onClick={joinChannel}>
        <div className={styles.channel_image}>
          <Avatar
            src={channelInfos.image}
            alt="channel image"
            sx={{
              width: 200,
              height: 200,
            }}
          >
            <Image
              src={channelImage}
              alt="channel image"
              width="200"
              height="200"
            />
          </Avatar>
        </div>
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
