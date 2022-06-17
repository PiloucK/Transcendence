import React from "react";

import styles from "../../styles/Home.module.css";
import { IUserPublic, PrivateConv } from "../../interfaces/IUser";

import Avatar from "@mui/material/Avatar";
// import profileIcon from "../../public/profile_icon.png";
import { useSessionContext } from "../../context/SessionContext";
import privateConvService from "../../services/privateConv";
import { useSocketContext } from "../../context/SocketContext";

export function CardUserDM({
  userInfos,
  setMenu,
}: {
  userInfos: IUserPublic;
  setMenu: (menu: string) => void;
}) {
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();

  const createPrivateConv = () => {
    if (
      sessionContext.userLogin !== null &&
      sessionContext.userLogin !== userInfos.login42
    ) {
      privateConvService
        .createPrivateConv(sessionContext.userLogin, userInfos.login42)
        .then((privateConv: PrivateConv) => {
          setMenu(
            privateConv.userOne.login42 + "|" + privateConv.userTwo.login42
          );
          socketContext.socket.emit("user:update-direct-messages");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div
      className={styles.user_card_dm}
      onClick={createPrivateConv}
      key={userInfos.login42}
    >
      <div className={styles.user_card_avatar}>
        <Avatar
          src={"../../public/profile_icon.png"}
          sx={{ width: "100px", height: "100px" }}
        />
      </div>
      <div className={styles.user_card_username}>{userInfos.username}</div>
      <div className={styles.user_card_elo}>Elo: {userInfos.elo}</div>
    </div>
  );
}
