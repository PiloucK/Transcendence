import React from "react";

import styles from "../../styles/Home.module.css";
import { Channel, ChannelCreation } from "../../interfaces/Chat.interfaces";

import Image from "next/image";
import Avatar from "@mui/material/Avatar";
import { useSessionContext } from "../../context/SessionContext";
import channelImage from "../../public/channel_image.png";
import channelService from "../../services/channel";

import { ChannelPasswordDialog } from "../Inputs/ChannelPasswordDialog";

import { errorHandler } from "../../errors/errorHandler";

import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";

export function CardPublicChannel({
  channelInfos,
  open,
  setOpen,
}: {
  channelInfos: Channel;
  open: { state: boolean; id: string };
  setOpen: (open: { state: boolean; id: string }) => void;
}) {
  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  //   const [open, setOpen] = React.useState(false);

  const joinChannel = () => {
    if (sessionContext.userSelf.login42 !== null) {
      if (channelInfos.password !== "") {
        setOpen({ state: true, id: channelInfos.id });
      } else {
        channelService
          .joinChannel(sessionContext.userSelf.login42, channelInfos.id)
          .then((channel: Channel) => {
            sessionContext.setChatMenu?.(channel.id);
            socketContext.socket.emit("user:update-joined-channels");
            socketContext.socket.emit("user:update-channel-content");
          })
          .catch((error) => {
            errorContext.newError?.(errorHandler(error, sessionContext));
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
        open={open.id === channelInfos.id ? open : { state: false, id: "" }}
        setOpen={setOpen}
      />
    </div>
  );
}
