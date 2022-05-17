import React from "react";
import styles from "../../styles/Home.module.css";
import Router from "next/router";

import { IUserPublicInfos, DM } from "../../interfaces/users";

import userService from "../../services/user";

import { useLoginContext } from "../../context/LoginContext";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

export function ButtonSendDM({
  userInfos,
}: {
  userInfos: IUserPublicInfos;
}) {
  const loginContext = useLoginContext();

  const sendDM = () => {
    if (
      loginContext.userLogin !== null &&
      loginContext.userLogin !== userInfos.login42
    ) {
      userService
        .createDM(loginContext.userLogin, userInfos.login42)
        .then((dm:DM) => {
					loginContext.setChatDM(dm.userOne.login42 + '|' + dm.userTwo.login42);
          socket.emit("user:update-direct-messages");
					Router.push('/chat');
        });
    }
  };

  return (
    <div className={styles.send_dm_button} onClick={sendDM}>
      Send DM
    </div>
  );
}
