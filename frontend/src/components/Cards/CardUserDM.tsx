import React from "react";

import styles from "../../styles/Home.module.css";
import { IUserPublicInfos, DM } from "../../interfaces/users";

import Avatar from "@mui/material/Avatar";
import profileIcon from "../../public/profile_icon.png";
import { useLoginContext } from "../../context/LoginContext";
import userService from "../../services/users";


import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

export function CardUserDM({ userInfos, setMenu }: { userInfos: IUserPublicInfos, setMenu: (menu: string) => void }) {
  const loginContext = useLoginContext();

  const createDM = () => {
    if (
      loginContext.userLogin !== null &&
      loginContext.userLogin !== userInfos.login42
    ) {
      userService
        .createDM(loginContext.userLogin, userInfos.login42)
        .then((dm:DM) => {
					setMenu(dm.userOne.login42 + '|' + dm.userTwo.login42);
          socket.emit("user:update-direct-messages");
        });
    }
  };

  return (
    <div
      className={styles.user_card_dm}
      onClick={createDM}
      key={userInfos.login42}
    >
      <div className={styles.user_card_avatar}>
        <Avatar src={profileIcon} sx={{ width: "100px", height: "100px" }} />
      </div>
      <div className={styles.user_card_username}>{userInfos.username}</div>
      <div className={styles.user_card_elo}>Elo: {userInfos.elo}</div>
    </div>
  );
}
