import React from "react";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import userService from "../services/users";
import { IUserPublicInfos } from "../interfaces/users";

import io from "socket.io-client";

import Avatar from "@mui/material/Avatar";

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

function Profile({
  state,
}: {
  state: { usrInfo: IUserPublicInfos; setUsrInfo: (usrInfos: IUserPublicInfos) => void };
}) {
  React.useEffect(() => {
    socket.on("update-leaderboard", () => {
      userService.getOne(state.usrInfo.username).then((user: IUserPublicInfos) => {
        state.setUsrInfo(user);
      });
    });
  }, []);

  return (
    <div className={styles.profile}>
      <AccountDetails userInfos={state.usrInfo} />
      <UserStats userInfos={state.usrInfo} />
    </div>
  );
}

export default function PublicProfile() {
  const router = useRouter();
  const { username } = router.query;

  const [userInfos, setUserInfos] = React.useState<IUserPublicInfos>({
    username: "",
    elo: 0,
    gamesWon: 0,
    gamesLost: 0,
  });

  if (username !== undefined && userInfos.username !== username) {
    userService.getOne(username).then((user: IUserPublicInfos) => {
      setUserInfos(user);
    });
  }

  if (
    username !== undefined &&
    userInfos.username !== undefined &&
    userInfos.username !== ""
  ) {
    return <Profile state={{ usrInfo: userInfos, setUsrInfo: setUserInfos }} />;
  } else {
    return <div>User not found</div>;
  }
}
