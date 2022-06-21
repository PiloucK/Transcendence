import React, { useState } from "react";
import styles from "../../styles/Home.module.css";
import { EmptyFriendList } from "../Social/emptyPages";

import { ChannelMenu } from "./Menus";
import { useLoginContext } from "../../context/LoginContext";
import { IUserPublicInfos, Channel, Message } from "../interfaces/users";
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
  const loginContext = useLoginContext();

  if (typeof channel === "undefined" || channel.messages.length === 0) {
    return (
      <div className={styles.social_empty_page}>
        <Image src={Rocket} />
        Be the first one to send a message !
      </div>
    );
  }

  const getStyle = (author: string) => {
    if (author === loginContext.userLogin) {
      return styles.message_author;
    } else {
      return styles.message_friend;
    }
  };

  const GetAvatar = ({ author }: { author: string }) => {
    if (author === loginContext.userLogin) {
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

export function ChannelPage({ channel }: { channel: Channel }) {
  const errorContext = useErrorContext();
  const loginContext = useLoginContext();
  const socketContext = useSocketContext();
  const [currentChannel, setCurrentChannel] = React.useState<Channel>();

  React.useEffect(() => {
    if (typeof channel !== "undefined") {
      channelService
        .getChannelById(loginContext.userLogin, channel.id)
        .then((channel: Channel) => {
          setCurrentChannel(channel);
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, loginContext));
        });
      socketContext.socket.on("update-channel-content", () => {
        channelService
          .getChannelById(loginContext.userLogin, channel.id)
          .then((channel: Channel) => {
            setCurrentChannel(channel);
          })
          .catch((error) => {
            errorContext.newError?.(errorHandler(error, loginContext));
          });
      });
    }
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
