import React from "react";

import styles from "../../styles/Home.module.css";

import { Channel } from "../../interfaces/Chat.interfaces";
import channelService from "../../services/channel";
import { useSessionContext } from "../../context/SessionContext";
import { useSocketContext } from "../../context/SocketContext";

export function ButtonTxtSetAsAdmin({
  login,
  channel,
}: {
  login: string;
  channel: Channel;
}) {
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();

  const handleRemoveOnClick = () => {
    if (sessionContext.userSelf.login42 !== null && sessionContext.userSelf.login42 !== login) {
      channelService
        .unsetAChannelAdmin(sessionContext.userSelf.login42, channel.id, login)
        .then(() => {
          socketContext.socket.emit("user:update-channel-content");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleAddOnClick = () => {
    if (sessionContext.userSelf.login42 !== null && sessionContext.userSelf.login42 !== login) {
      channelService
        .setAChannelAdmin(sessionContext.userSelf.login42, channel.id, login)
        .then(() => {
          socketContext.socket.emit("user:update-channel-content");
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
