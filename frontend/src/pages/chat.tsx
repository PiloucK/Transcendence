import React from "react";

import { ChatMenu } from "../components/Chat/Menus";

import { Channel } from "../interfaces/users";
import { DirectMessage } from "../components/Chat/DirectMessage";
import { AddChannel } from "../components/Chat/AddChannel";
import { ChannelPage } from "../components/Chat/Channel";
import { useLoginContext } from "../context/LoginContext";
import { DockGuest } from "../components/Dock/DockGuest";
import { useSocketContext } from "../context/SocketContext";
import channelService from "../services/channel";

function ChatContent({
  menu,
  channels,
}: {
  menu: string;
  channels: Channel[];
}) {
  if (menu === "direct_message") {
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
  const loginContext = useLoginContext();
  const socketContext = useSocketContext();
  const [channels, setChannels] = React.useState<Channel[]>([]);

  React.useEffect(() => {
    if (loginContext.userLogin) {
      channelService
        .getJoinedChannels(loginContext.userLogin)
        .then((currentChannels: Channel[]) => {
          setChannels(currentChannels);
        });
      socketContext.socket.on("update-channels-list", () => {
        channelService
          .getJoinedChannels(loginContext.userLogin)
          .then((currentChannels: Channel[]) => {
            setChannels(currentChannels);
          });
      });
      socketContext.socket.on("update-channel-content", () => {
        channelService
          .getJoinedChannels(loginContext.userLogin)
          .then((currentChannels: Channel[]) => {
            setChannels(currentChannels);
          });
      });
    }
  }, [loginContext.userLogin]);

  if (loginContext.userLogin === null) {
    return <DockGuest />;
  }

  if (typeof channels === "undefined" || channels.length === 0) {
    return <div>Loading</div>;
  }
  return (
    <>
      <ChatMenu channels={channels} />
      <ChatContent channels={channels} menu={loginContext.chatMenu} />
    </>
  );
}
