import React from "react";

import styles from "../../styles/Home.module.css";
import { IUserSlim } from "../../interfaces/IUser";
import { PrivateConv } from "../../interfaces/Chat.interfaces";

import Avatar from "@mui/material/Avatar";

import { errorHandler } from "../../errors/errorHandler";

import { useErrorContext } from "../../context/ErrorContext";
import { useSessionContext } from "../../context/SessionContext";
import privateConvService from "../../services/privateConv";
import { useSocketContext } from "../../context/SocketContext";
import { defaultSessionState } from "../../constants/defaultSessionState";

export function CardUserDM({
  userInfos,
  setMenu,
}: {
  userInfos: IUserSlim;
  setMenu: ((menu: string) => void) | undefined;
}) {
  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();

  const createPrivateConv = () => {
    if (
      sessionContext.userSelf.login42 !==
        defaultSessionState.userSelf.login42 &&
      sessionContext.userSelf.login42 !== userInfos.login42
    ) {
      privateConvService
        .createPrivateConv(sessionContext.userSelf.login42, userInfos.login42)
        .then((privateConv: PrivateConv) => {
          setMenu?.(
            privateConv.userOne.login42 + "|" + privateConv.userTwo.login42
          );
          socketContext.socket.emit("user:update-direct-messages");
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
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
          src={userInfos.image}
          alt="avatar"
          sx={{ width: 100, height: 100 }}
        >
          <Avatar
            src={userInfos.photo42}
            alt="avatar"
            sx={{ width: 100, height: 100 }}
          />
        </Avatar>
      </div>
      <div className={styles.user_card_username}>
        {userInfos.username ?? defaultSessionState.userSelf.username}
      </div>
      <div className={styles.user_card_elo}>Elo: {userInfos.elo}</div>
    </div>
  );
}
