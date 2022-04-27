import React from "react";

import styles from "../../styles/Home.module.css";
import { IUserPublicInfos } from "../../interfaces/users";

import { Avatar } from "@mui/material/Avatar";
import Image from "next/image";
import profileIcon from "../../public/profile_icon.png"

export function CardUserNoInteractions({
  userInfos,
}: {
  userInfos: IUserPublicInfos;
}) {
  return (
    <div className={styles.user_card} key={userInfos.login42}>
      <div className={styles.user_card_avatar}>
        <Avatar
          src={profileIcon}
					sx={{width:"100px", height:"100px"}}
        />
      </div>
      <div className={styles.user_card_username}>
        {userInfos.username}
      </div>
      <div className={styles.user_card_elo}>Elo: {userInfos.elo}</div>
    </div>
  );
}
