import React from "react";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";
import userService from "../../services/users";
import { IUserPublicInfos } from "../../interfaces/users";

import Link from "next/link";

import io from "socket.io-client";

import Avatar from "@mui/material/Avatar";

import { UserGameHistory } from "./UserGameHistory";
import { ButtonAddFriend } from "../Buttons/ButtonAddFriend";
import { ButtonRemoveFriend } from "../Buttons/ButtonRemoveFriend";
import { ButtonUserStatus } from "../Buttons/ButtonUserStatus";
import { ButtonBlock } from "../Buttons/ButtonBlock";

import { useLoginContext } from "../../context/LoginContext";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

function UserName({ userInfos }: { userInfos: IUserPublicInfos }) {
  return (
    <div className={styles.profile_user_account_details_username}>
      {userInfos?.username}
    </div>
  );
}

function UserAvatar({ userInfos }: { userInfos: IUserPublicInfos }) {
  return (
    <div className={styles.profile_user_account_details_avatar}>
      <Avatar
        img="/public/profile_icon.png"
        alt="avatar"
        sx={{ width: 151, height: 151 }}
      />
    </div>
  );
}

function AccountDetails({ userInfos }: { userInfos: IUserPublicInfos }) {
  return (
    <div className={styles.profile_user_account_details}>
      <div className={styles.profile_user_account_details_title}>
        Account details
      </div>
      <UserAvatar userInfos={userInfos} />
      <UserName userInfos={userInfos} />
    </div>
  );
}

function UserStats({ userInfos }: { userInfos: IUserPublicInfos }) {
  return (
    <div className={styles.profile_user_stats}>
      <div className={styles.profile_user_stats_header}>
        <div className={styles.profile_user_stats_header_title}>Stats</div>
      </div>
      <div className={styles.profile_user_stats_elo}>Elo: {userInfos?.elo}</div>
      <div className={styles.profile_user_stats_games_summary}>
        Games won: {userInfos?.gamesWon}
        <br />
        Games lost: {userInfos?.gamesLost}
      </div>
    </div>
  );
}

function PublicProfileButtons({ userInfos }: { userInfos: IUserPublicInfos }) {
  const loginContext = useLoginContext();

  if (loginContext.userLogin === userInfos.login42) {
    return (
      <div className={styles.public_profile_buttons}>
        <Link href="/profile">
          <div className={styles.add_friend_button}>Your profile</div>
        </Link>
      </div>
    );
  } else {
    return (
      <div className={styles.public_profile_buttons}>
        <ButtonUserStatus userInfos={userInfos} />
        <ButtonAddFriend userInfos={userInfos} />
        <ButtonBlock userInfos={userInfos} />
      </div>
    );
  }
}

function Profile({
  state,
}: {
  state: {
    usrInfo: IUserPublicInfos;
    setUsrInfo: (usrInfos: IUserPublicInfos) => void;
  };
}) {
  React.useEffect(() => {
    socket.on("update-leaderboard", () => {
      userService
        .getOne(state.usrInfo.username)
        .then((user: IUserPublicInfos) => {
          state.setUsrInfo(user);
        });
    });
  }, []);

  return (
    <>
      <div className={styles.profile_user}>
        <AccountDetails userInfos={state.usrInfo} />
        <UserStats userInfos={state.usrInfo} />
        <PublicProfileButtons userInfos={state.usrInfo} />
      </div>
      <UserGameHistory userLogin={state.usrInfo.login42} />
    </>
  );
}

export default function PublicProfile({ login }: { login: string }) {
  const [userInfos, setUserInfos] = React.useState<IUserPublicInfos>({
    login42: "",
    username: "",
    elo: 0,
    gamesWon: 0,
    gamesLost: 0,
  });

  if (
    login !== undefined &&
    userInfos !== undefined &&
    userInfos.username !== login
  ) {
    userService.getOne(login).then((user: IUserPublicInfos) => {
      setUserInfos(user);
    });
  }

  if (
    login !== undefined &&
    userInfos !== undefined &&
    userInfos.username !== undefined &&
    userInfos.username !== ""
  ) {
    return <Profile state={{ usrInfo: userInfos, setUsrInfo: setUserInfos }} />;
  } else {
    return <div>User not found</div>;
  }
}
