import React from "react";

import { ChatMenu } from "../components/Chat/Menus";
import styles from "../styles/Home.module.css";

import { Channel } from "../interfaces/users";
import { DirectMessage } from "../components/Chat/DirectMessage";
import { AddChannel } from "../components/Chat/AddChannel";
import { ChannelPage } from "../components/Chat/Channel";
import { useSessionContext } from "../context/SessionContext";
import { DockGuest } from "../components/Dock/DockGuest";

import { errorHandler } from "../errors/errorHandler";

import { useErrorContext } from "../context/ErrorContext";
import { useSocketContext } from "../context/SocketContext";
import channelService from "../services/channel";
import CircularProgress from "@mui/material/CircularProgress";

function ChatContent({
  menu,
  channels,
}: {
  menu: string;
  channels: Channel[];
}) {
  if (typeof channels === "undefined") {
    return null;
  } else if (
    menu === "direct_message" ||
    (menu !== "direct_message" &&
      menu !== "add_channel" &&
      channels.length === 0)
  ) {
    return <DirectMessage />;
  } else if (menu === "add_channel") {
    return <AddChannel />;
  } else {
    return (
      <ChannelPage channel={channels.find((channel) => channel.id === menu)} />
    );
  }
}

export default function Chat() {
  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const [channels, setChannels] = React.useState<Channel[]>([]);

  const fetchChannels = () => {
    if (sessionContext.userSelf.login42 !== "Norminet") {
      channelService
        .getJoinedChannels(sessionContext.userSelf.login42)
        .then((currentChannels: Channel[]) => {
          setChannels(currentChannels);
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
        });
    }
  };

  React.useEffect(fetchChannels, [sessionContext]);

  React.useEffect(() => {
    socketContext.socket.on("update-channels-list", fetchChannels);
    return () => {
      socketContext.socket.removeListener(
        "update-channels-list",
        fetchChannels
      );
    };
  }, []);

  if (sessionContext.userSelf.login42 === "Norminet") {
    return <DockGuest />;
  }

  if (typeof channels === "undefined") {
    return (
      <div className={styles.play}>
        <CircularProgress />
      </div>
    );
  } else {
    return (
      <>
        <ChatMenu channels={channels} />
        <ChatContent channels={channels} menu={sessionContext.chatMenu} />
      </>
    );
  }
}
