import { ButtonLogout } from "../components/Buttons/ButtonLogout";
import styles from "../styles/Home.module.css";
import { useLoginContext } from "../context/LoginContext";

import IconButton from "@mui/material/IconButton";
import CreateIcon from "@mui/icons-material/Create";
import CheckIcon from "@mui/icons-material/Check";
import TextField from "@mui/material/TextField";

import React, { useEffect } from "react";
import { FormEventHandler, ChangeEventHandler, useState } from "react";
import userService from "../services/user";
import { IUser } from "../interfaces/users";

import Avatar from "@mui/material/Avatar";
import { DockGuest } from "../components/Dock/DockGuest";

import { useRouter } from "next/router";
import { UserGameHistory } from "../components/Profile/UserGameHistory";
import PublicProfile from "../components/Profile/publicprofile";

import { ProfileSettingsDialog } from "../components/Inputs/ProfileSettingsDialog";
import { errorHandler } from "../errors/errorHandler";

import { useErrorContext } from "../context/ErrorContext";
import { useSocketContext } from "../context/SocketContext";

function MyAvatar({ userInfos }: { userInfos: IUser }) {
  return (
    <div className={styles.profile_user_account_details_avatar}>
      <Avatar
        src={userInfos.image}
        alt="avatar"
        sx={{ width: 151, height: 151 }}
      >
        <Avatar
          src={userInfos.photo42}
          alt="avatar"
          sx={{ width: 151, height: 151 }}
        />
      </Avatar>
    </div>
  );
}

function MyAccountDetails({ userInfos }: { userInfos: IUser }) {
  return (
    <div className={styles.profile_user_account_details}>
      <div className={styles.profile_user_account_details_title}>
        Account details
      </div>
      <MyAvatar userInfos={userInfos} />
      <div className={styles.profile_user_account_details_username}>
        {userInfos.username}
      </div>
    </div>
  );
}

function UserStats({ userInfos }: { userInfos: IUser }) {
  return (
    <div className={styles.profile_user_stats}>
      <div className={styles.profile_user_stats_header}>
        <div className={styles.profile_user_stats_header_title}>Stats</div>
      </div>
      <div className={styles.profile_user_stats_elo}>Elo: {userInfos.elo}</div>
      <div className={styles.profile_user_stats_games_summary}>
        Games won: {userInfos.gamesWon}
        <br />
        Games lost: {userInfos.gamesLost}
      </div>
    </div>
  );
}

function Profile({
  state,
}: {
  state: { userInfos: IUser; setUserInfos: (userInfos: IUser) => void };
}) {
  const errorContext = useErrorContext();
  const loginContext = useLoginContext();
  const [open, setOpen] = useState(false);
  const socketContext = useSocketContext();

  React.useEffect(() => {
    socketContext.socket.on("update-leaderboard", () => {
      userService
        .getOne(loginContext.userLogin)
        .then((user: IUser) => {
          state.setUserInfos(user);
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, loginContext));
        });
    });
  }, []);

  return (
    <>
      <div className={styles.profile_user}>
        <MyAccountDetails userInfos={state.userInfos} />
        <UserStats userInfos={state.userInfos} />
        <ButtonLogout />
        <ProfileSettingsDialog
          user={state.userInfos}
          open={open}
          setOpen={setOpen}
        />
      </div>
      <UserGameHistory userLogin={loginContext.userLogin} />
    </>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { login } = router.query;
  const errorContext = useErrorContext();
  const loginContext = useLoginContext();

  if (
    login !== undefined &&
    loginContext.userLogin !== null &&
    login !== loginContext.userLogin
  ) {
    return <PublicProfile login={login} />;
  }
  const [userInfos, setUserInfos] = useState<IUser>({
    id: "",
    login42: "",
    image: "",
    photo42: "",
    token42: "",
    twoFa: false,
    username: "",
    elo: 0,
    gamesWon: 0,
    gamesLost: 0,
  });

  useEffect(() => {
    if (
      loginContext.userLogin !== null &&
      userInfos !== undefined &&
      loginContext.userLogin !== userInfos.login42
    ) {
      userService
        .getOne(loginContext.userLogin)
        .then((user: IUser) => {
          setUserInfos(user);
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, loginContext));
        });
    }
  }, []);

  if (loginContext.userLogin === null) return <DockGuest />;
  if (userInfos === undefined || userInfos.login42 === "") return null; // We may want to display a loading screen here
  return (
    <Profile state={{ userInfos: userInfos, setUserInfos: setUserInfos }} />
  );
}
