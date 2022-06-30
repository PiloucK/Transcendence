import React, { useState } from "react";
import styles from "../../styles/Home.module.css";
import { EmptyFriendList } from "../Social/emptyPages";

import { ChannelMenu } from "./Menus";
import { useSessionContext } from "../../context/SessionContext";
import { Channel, Message } from "../../interfaces/Chat.interfaces";
import channelService from "../../services/channel";
import { CardUserDM } from "../Cards/CardUserDM";

import Image from "next/image";
import Rocket from "../../public/no_dm_content.png";
import Avatar from "@mui/material/Avatar";

import { SendMessageField } from "../Inputs/SendMessageField";

import { errorHandler } from "../../errors/errorHandler";

import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";
import CircularProgress from "@mui/material/CircularProgress";

function Messages({ channel }: { channel: Channel }) {
  const sessionContext = useSessionContext();

  const setScroll = () => {
    if (typeof window !== "undefined") {
      var messageBody = document.querySelector("#channelMsgArea");
      if (messageBody) {
        messageBody.scrollTop =
          messageBody.scrollHeight - messageBody.clientHeight;
      }
    }
  };

  React.useEffect(() => {
    setScroll();
  }, [channel]);

  if (typeof channel === "undefined" || channel.messages.length === 0) {
    return (
      <div className={styles.social_empty_page}>
        <Image src={Rocket} />
        Be the first one to send a message !
      </div>
    );
  }

  const getStyle = (author: string) => {
    if (author === sessionContext.userSelf.login42) {
      return styles.message_author;
    } else {
      return styles.message_friend;
    }
  };

  const GetAvatar = ({ author }: { author: string }) => {
    if (author === sessionContext.userSelf.login42) {
      return null;
    } else {
      const user = channel.users.find((user) => user.login42 === author);
      if (typeof user === "undefined") {
        return null;
      }
      if (user.image) {
        return (
          <Avatar
            className={styles.chat_avatar}
            src={user.image}
            sx={{ width: "40px", height: "40px" }}
          />
        );
      } else {
        return (
          <Avatar
            className={styles.chat_avatar}
            src={user.photo42}
            sx={{ width: "40px", height: "40px" }}
          />
        );
      }
    }
  };

  return (
    <>
      <div className={styles.messages_area} id="channelMsgArea">
        {channel.messages.map((message, index) => (
          <div className={getStyle(message.author)} key={index}>
            {message.content}
            <GetAvatar author={message.author} />
          </div>
        ))}
      </div>
    </>
  );
}

function ChannelContent({ channel }: { channel: Channel }) {
  const [input, setInput] = React.useState("");

  return (
    <div className={styles.chat_direct_message_content}>
      <SendMessageField
        input={input}
        setInput={setInput}
        channel={channel?.id}
      />
      <Messages channel={channel} />
    </div>
  );
}

export function ChannelPage({ channel }: { channel: Channel | undefined }) {
  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const [currentChannel, setCurrentChannel] = React.useState<Channel>();

  const fetchCurrentChannel = () => {
    if (typeof channel !== "undefined") {
      channelService
        .getChannelById(sessionContext.userSelf.login42, channel.id)
        .then((channel: Channel) => {
          setCurrentChannel(channel);
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
        });
    }
  };

  React.useEffect(() => {
    fetchCurrentChannel();
	socketContext.socket.on("update-channel-content", fetchCurrentChannel);
    return () => {
      socketContext.socket.removeListener(
        "update-channel-content",
        fetchCurrentChannel
      );
    };
  }, [channel]);

  if (typeof currentChannel === "undefined" || typeof channel === "undefined") {
    return (
      <div className={styles.play}>
        <CircularProgress />
      </div>
    );
  }
  return (
    <>
      <ChannelMenu channel={currentChannel} />
      <ChannelContent channel={currentChannel} />
    </>
  );
}
