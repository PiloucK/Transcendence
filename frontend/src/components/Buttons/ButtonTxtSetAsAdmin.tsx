import React from "react";

import styles from "../../styles/Home.module.css";

import { IUserPublicInfos, Channel } from "../../interfaces/users";
import channelService from "../../services/channel";
import { useLoginContext } from "../../context/LoginContext";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

export function ButtonTxtSetAsAdmin({
  login,
  channel,
}: {
  login: string;
  channel: Channel;
}) {
  const loginContext = useLoginContext();

  const handleRemoveOnClick = () => {
    if (loginContext.userLogin !== null && loginContext.userLogin !== login) {
      channelService
        .unsetAChannelAdmin(loginContext.userLogin, channel.id, login)
        .then(() => {
          socket.emit("user:update-channel-content");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleAddOnClick = () => {
    if (loginContext.userLogin !== null && loginContext.userLogin !== login) {
      channelService
        .setAChannelAdmin(loginContext.userLogin, channel.id, login)
        .then(() => {
          socket.emit("user:update-channel-content");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  if (channel?.admins?.find((admin: string) => admin === login)) {
    return (
      <div className={styles.buttons} onClick={handleRemoveOnClick}>
        Unset admin
      </div>
    );
  } else {
    return (
      <div className={styles.buttons} onClick={handleAddOnClick}>
        Set as admin
      </div>
    );
  }
}
