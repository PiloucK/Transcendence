import React from "react";

import styles from "../../styles/Home.module.css";

import { Channel } from "../../interfaces/users";
import channelService from "../../services/channel";
import { useLoginContext } from "../../context/LoginContext";
import { useSocketContext } from "../../context/SocketContext";

export function ButtonTxtSetAsAdmin({
  login,
  channel,
}: {
  login: string;
  channel: Channel;
}) {
  const loginContext = useLoginContext();
  const socketContext = useSocketContext();

  const handleRemoveOnClick = async () => {
    if (loginContext.userLogin !== null && loginContext.userLogin !== login) {
      await channelService
        .unsetAChannelAdmin(loginContext.userLogin, channel.id, login)
        .catch((err) => {
          console.log(err);
        });

      socketContext.socket.emit("user:update-channel-content");
    }
  };

  const handleAddOnClick = async () => {
    if (loginContext.userLogin !== null && loginContext.userLogin !== login) {
      await channelService
        .setAChannelAdmin(loginContext.userLogin, channel.id, login)
        .catch((err) => {
          console.log(err);
        });

      socketContext.socket.emit("user:update-channel-content");
    }
  };

  if (channel?.admin?.find((admin: string) => admin === login)) {
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
