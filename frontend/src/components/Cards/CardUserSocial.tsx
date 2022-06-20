import React from "react";

import styles from "../../styles/Home.module.css";
import { IUserPublicInfos } from "../../interfaces/users";

import Link from "next/link";

import Avatar from "@mui/material/Avatar";
import { ButtonUserStatus } from "../Buttons/ButtonUserStatus";

export function CardUserSocial({ userInfos }: { userInfos: IUserPublicInfos }) {
  return (
    <div className={styles.social_friend_card} key={userInfos.login42}>
      <Link href={`/profile?login=${userInfos.login42}`}>
        <div className={styles.social_friend_card_avatar}>
          <Avatar
            src={userInfos.image}
            alt="avatar"
            sx={{ width: 60, height: 60 }}
          >
            <Avatar
              src={userInfos.photo42}
              alt="avatar"
              sx={{ width: 60, height: 60 }}
            />
          </Avatar>
        </div>
      </Link>
      <div className={styles.social_friend_card_username}>
        {userInfos.username}
      </div>
      <div className={styles.social_friend_card_elo}>Elo: {userInfos.elo}</div>
      <ButtonUserStatus userInfos={userInfos} />
    </div>
  );
}
