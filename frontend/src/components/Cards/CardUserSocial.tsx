import React from "react";

import styles from "../../styles/Home.module.css";
import { IUserPublicInfos } from "../../interfaces/users";

import Link from "next/link";

import Avatar from "@mui/material/Avatar";

export function CardUserSocial({ userInfos }: { userInfos: IUserPublicInfos }) {
  return (
    <Link href={`/profile?login=${userInfos.login42}`}>
			<div className={styles.social_friend_card}>
      <Avatar
        img="/public/profile_icon.png"
        alt="avatar"
        sx={{ width: 60, height: 60 }}
      />
        {userInfos.username}
        <br />
        Elo: {userInfos.elo}
      </div>
    </Link>
  );
}
