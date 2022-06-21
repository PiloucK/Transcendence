import React from "react";

import styles from "../../styles/Home.module.css";

import { IUserPublicInfos, Channel } from "../../interfaces/users";
import channelService from "../../services/channel";

import { errorHandler } from "../../errors/errorHandler";

import { useErrorContext } from "../../context/ErrorContext";
import { useLoginContext } from "../../context/LoginContext";
import { useSocketContext } from "../../context/SocketContext";

export function ButtonTxtSetAsAdmin({
  login,
  channel,
}: {
  login: string;
  channel: Channel;
}) {
  const errorContext = useErrorContext();
  const loginContext = useLoginContext();
  const socketContext = useSocketContext();

  const handleRemoveOnClick = () => {
    if (loginContext.userLogin !== null && loginContext.userLogin !== login) {
      channelService
        .unsetAChannelAdmin(loginContext.userLogin, channel.id, login)
        .then(() => {
          socketContext.socket.emit("user:update-channel-content");
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, loginContext));
        });
    }
  };

  const handleAddOnClick = () => {
    if (loginContext.userLogin !== null && loginContext.userLogin !== login) {
      channelService
        .setAChannelAdmin(loginContext.userLogin, channel.id, login)
        .then(() => {
          socketContext.socket.emit("user:update-channel-content");
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, loginContext));
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
