import React from "react";
import styles from "../../styles/Home.module.css";
import Router from "next/router";

import { IUserPublic } from "../../interfaces/IUser";
import { PrivateConv } from "../../interfaces/Chat.interfaces";

import privateConvService from "../../services/privateConv";

import { useSessionContext } from "../../context/SessionContext";
import { useSocketContext } from "../../context/SocketContext";

export function ButtonSendDM({ userInfos }: { userInfos: IUserPublic }) {
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();

  const sendPrivateMessage = () => {
    if (
      sessionContext.userSelf.login42 !== null &&
      sessionContext.userSelf.login42 !== userInfos.login42
    ) {
      privateConvService
        .createPrivateConv(sessionContext.userSelf.login42, userInfos.login42)
        .then((dm: PrivateConv) => {
          sessionContext.setChatDM(
            dm.userOne.login42 + "|" + dm.userTwo.login42
          );
          socketContext.socket.emit("user:update-direct-messages");
          Router.push("/chat");
        });
    }
  };

  return (
    <div className={styles.send_dm_button} onClick={sendPrivateMessage}>
      Send PrivateConv
    </div>
  );
}
