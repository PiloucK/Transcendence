import React from "react";

import styles from "../../styles/Home.module.css";
import { Channel, ChannelCreation } from "../../interfaces/users";

import Avatar from "@mui/material/Avatar";
// import profileIcon from "../../public/profile_icon.png";
import { useLoginContext } from "../../context/LoginContext";
import userService from "../../services/users";


import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

export function CardPublicChannel({ channelInfos, index }: { channelInfos: ChannelCreation, index: number }) {
  const loginContext = useLoginContext();

  const joinChannel = () => {
    //Call the service to join the channel.
		// userService
		//	.joinChannel(loginContext.userLogin, channelInfos.id)
		//	.then((channel: Channel) => {
		//		setMenu(channel.id);
  };

  return (
    <div
      className={styles.channel_card}
      onClick={joinChannel}
      key={index}
    >
			{/* Channel Avatar here */}
      <div className={styles.channel_name}>{channelInfos.name}</div>
    </div>
  );
}
