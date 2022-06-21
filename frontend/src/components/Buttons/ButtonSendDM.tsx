import React from "react";
import styles from "../../styles/Home.module.css";
import Router from "next/router";

import { IUserPublicInfos, PrivateConv } from "../../interfaces/users";

import privateConvService from "../../services/privateConv";

import { errorHandler } from "../../errors/errorHandler";

import { useErrorContext } from "../../context/ErrorContext";
import { useLoginContext } from "../../context/LoginContext";
import { useSocketContext } from "../../context/SocketContext";

export function ButtonSendDM({ userInfos }: { userInfos: IUserPublicInfos }) {
  const errorContext = useErrorContext();
  const loginContext = useLoginContext();
  const socketContext = useSocketContext();

  const sendPrivateMessage = () => {
    if (
      loginContext.userLogin !== null &&
      loginContext.userLogin !== userInfos.login42
    ) {
      privateConvService
        .createPrivateConv(loginContext.userLogin, userInfos.login42)
        .then((dm: PrivateConv) => {
          loginContext.setChatMenu?.("direct_message");
          loginContext.setChatDM?.(
            dm.userOne.login42 + "|" + dm.userTwo.login42
          );
          socketContext.socket.emit("user:update-direct-messages");
          Router.push("/chat");
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, loginContext));
        });
    }
  };

  return (
    <div className={styles.send_dm_button} onClick={sendPrivateMessage}>
      Send message
    </div>
  );
}
