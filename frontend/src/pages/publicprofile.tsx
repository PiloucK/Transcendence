import React from "react";
import { useRouter } from "next/router";
import { useLoginContext } from "../context/LoginContext";
import styles from "../styles/Home.module.css";
import userService from "../services/users";

import io from "socket.io-client";

import Avatar from "@mui/material/Avatar";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

interface UserInfos {
  id: string;
  login: string;
  level: number;
  ranking: number;
  gamesWin: number;
  gamesLost: number;
}

function UserName({ userInfos }: { userInfos: UserInfos }) {
  return (
    <div className={styles.profile_user_account_details_username}>
      {userInfos.login}
    </div>
  );
}

function UserAvatar({ userInfos }: { userInfos: UserInfos }) {
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

function AccountDetails({ userInfos }: { userInfos: UserInfos }) {
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

function UserStats({ userInfos }: { userInfos: UserInfos }) {

  return (
    <div className={styles.profile_user_stats}>
      <div className={styles.profile_user_stats_header}>
        <div className={styles.profile_user_stats_header_title}>Stats</div>
      </div>
      <div className={styles.profile_user_stats_elo}>
        Elo: {userInfos.ranking}
      </div>
      <div className={styles.profile_user_stats_games_summary}>
        Games won: {userInfos.gamesWin}
        <br />
        Games lost: {userInfos.gamesLost}
      </div>
    </div>
  );
}

function PublicProfile({ userInfos }: { userInfos: UserInfos }) {
  console.log(userInfos);
  return (
    <div className={styles.profile}>
      <AccountDetails userInfos={userInfos} />
      <UserStats userInfos={userInfos} />
    </div>
  );
}

export default function Components() {
  const router = useRouter();
  const { login } = router.query;

  const [userInfos, setUserInfos] = React.useState<UserInfos>({
    id: "",
    login: "",
    level: 0,
    ranking: 0,
    gamesWin: 0,
    gamesLost: 0,
  });

  React.useEffect(() => {
    userService.getOne(login).then((user: UserInfos) => {
      setUserInfos(user);
    });

    socket.on("leaderboardUpdate", () => {
      userService.getOne(login).then((user: UserInfos) => {
        setUserInfos(user);
      });
    });
  }, []);

  if (login !== undefined && userInfos.login !== undefined) {
    return <PublicProfile userInfos={userInfos} />;
  } else {
    return <div>User not found</div>;
  }
}
