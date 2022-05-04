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

function ChannelContent({ channel }: { channel: Channel }) {
  return (
    <div className={styles.channel_content}>
      This is the channel of {channel?.owner}
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
  }, [id]);

  return (
    <>
      <ChannelMenu channel={channel} />
      <ChannelContent channel={channel} />
    </>
  );
}
