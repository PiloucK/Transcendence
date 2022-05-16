import React, { useState } from "react";
import styles from "../../styles/Home.module.css";
import { EmptyFriendList } from "../Social/emptyPages";

import { ChannelMenu } from "./Menus";
import { useLoginContext } from "../../context/LoginContext";
import { IUserPublicInfos, Channel, IMessage } from "../interfaces/users";
import userService from "../../services/users";
import { CardUserDM } from "../Cards/CardUserDM";

import Image from "next/image";
import Rocket from "../../public/no_dm_content.png";

import { SendMessageField } from "../Inputs/SendMessageField";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

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

  const setScroll = () => {
    if (typeof window !== "undefined") {
			var elem = document.getElementById("channelMsgArea");
			if (elem) {
				elem.scrollTop = elem.scrollHeight;
			}
    }
  };

  return (
    <>
      <div className={styles.messages_area} id="channelMsgArea">
        {channel.messages.map((message, index) => (
          <div className={getStyle(message.author)} key={index}>
            {message.content}
          </div>
        ))}
      </div>
      {setScroll()}
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

export function Channel({ id }: { id: string }) {
  const loginContext = useLoginContext();
  const [channel, setChannel] = useState<Channel>();

  React.useEffect(() => {
    userService
      .getChannelById(loginContext.userLogin, id)
      .then((channel: Channel) => {
        setChannel(channel);
      });

    socket.on("update-channel-content", () => {
      userService
        .getChannelById(loginContext.userLogin, id)
        .then((channel: Channel) => {
          setChannel(channel);
        });
    });
  }, []);

  return (
    <>
      <ChannelMenu channel={channel} />
      <ChannelContent channel={channel} />
    </>
  );
}
