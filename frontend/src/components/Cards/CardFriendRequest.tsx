import React from "react";

import styles from "../../styles/Home.module.css";
import { IUserPublicInfos } from "../../interfaces/users";

import Link from "next/link";

import Avatar from "@mui/material/Avatar";
import { ButtonsFriendRequest } from "../Buttons/ButtonsFriendRequest";

export function CardFriendRequest({ userInfos }: { userInfos: IUserPublicInfos }) {
  return (
    <div className={styles.social_friend_card} key={userInfos.login42}>
      <Link href={`/profile?login=${userInfos.login42}`}>
        <div className={styles.social_friend_card_avatar}>
          <Avatar
            img="/public/profile_icon.png"
            alt="avatar"
            sx={{ width: 60, height: 60 }}
          />
        </div>
      </Link>
      <div className={styles.social_friend_card_username}>
        {userInfos.username}
      </div>
      <div className={styles.social_friend_card_elo}>Elo: {userInfos.elo}</div>
      <ButtonsFriendRequest userInfos={userInfos} />
    </div>
  );
}
