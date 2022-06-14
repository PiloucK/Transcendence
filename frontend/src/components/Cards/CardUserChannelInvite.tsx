import React from "react";

import styles from "../../styles/Home.module.css";
import { IUserPublicInfos } from "../../interfaces/users";

import Avatar from "@mui/material/Avatar";
import profileIcon from "../../public/profile_icon.png";

export function CardUserChannelInvite({
  userInfos,
  setSelectedFriends,
}: {
  userInfos: IUserPublicInfos;
  setSelectedFriends: (friends: IUserPublicInfos) => void;
}) {
  const [isSelected, setIsSelected] = React.useState(false);

  const handleClick = () => {
    setIsSelected(!isSelected);
    setSelectedFriends(userInfos);
  };

  const getStyle = () => {
    if (isSelected) {
      return styles.invite_user_card_selected;
    } else {
      return styles.invite_user_card;
    }
  };

  return (
    <div className={getStyle()} onClick={handleClick} key={userInfos.login42}>
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
      <div className={styles.user_card_username}>{userInfos.username}</div>
      <div className={styles.user_card_elo}>Elo: {userInfos.elo}</div>
    </div>
  );
}
