import { ButtonLogout } from "../hooks/ButtonLogout";
import styles from "../styles/Home.module.css";
import { useLoginContext } from "../context/LoginContext";

import IconButton from "@mui/material/IconButton";
import CreateIcon from "@mui/icons-material/Create";
import CheckIcon from "@mui/icons-material/Check";
import TextField from "@mui/material/TextField";

import React from "react";
import { FormEventHandler, ChangeEventHandler, useState } from "react";
import userService from "../services/users";

import io from "socket.io-client";

// import Image from "next/image";
// import UserAvatar from "../public/profile_icon.png"
import Avatar from "@mui/material/Avatar";
import { DockGuest } from "../components/Dock/DockGuest";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

interface UserInfos {
  id: string;
  login: string;
  level: number;
  ranking: number;
  gamesWin: number;
  gamesLost: number;
}

function MyUserName() {
  const loginContext = useLoginContext();
  const [isInModification, setIsInModification] = useState(false);
  const [tmpUsername, setTmpUsername] = useState(""); // tmpUsername -> usernameInput?

  const changeUsername: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setIsInModification(false);

    if (tmpUsername !== "") {
      userService
        .changeUsername(loginContext.userName, tmpUsername) // change loginContext.userName to loginContext.login? or to loginContext.login42?
        .then(() => {
          loginContext.login(tmpUsername, loginContext.userSecret);
          setTmpUsername("");
          socket.emit("user:update-username");
          //Emit on the socket here.
        });
    }
  };

  const handleUsernameChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setTmpUsername(event.target.value);
  };

  if (loginContext.userName === null) return null;
  if (isInModification === false) {
    return (
      <div className={styles.profile_user_account_details_username}>
        {loginContext.userName}
        <IconButton
          className={styles.icons}
          aria-label="userName edit"
          onClick={() => setIsInModification(true)}
        >
          <CreateIcon />
        </IconButton>
      </div>
    );
  } else {
    return (
      <div className={styles.profile_user_account_details_username}>
        <form onSubmit={changeUsername}>
          <TextField
            value={tmpUsername}
            onChange={handleUsernameChange}
            label={loginContext.userName}
          />
          <IconButton type="submit">
            <CheckIcon />
          </IconButton>
        </form>
      </div>
    );
  }
}

function MyAvatar() {
  const loginContext = useLoginContext();

  if (loginContext.userName === null) return null;
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

function MyAccountDetails() {
  return (
    <div className={styles.profile_user_account_details}>
      <div className={styles.profile_user_account_details_title}>
        Account details
      </div>
      <MyAvatar />
      <MyUserName />
    </div>
  );
}

function UserStats() {
  const loginContext = useLoginContext();
  const [userInfos, setUserInfos] = useState<UserInfos>({
    id: "",
    login: "",
    level: 0,
    ranking: 0,
    gamesWin: 0,
    gamesLost: 0,
  });

  if (loginContext.userName === null) return null;

  React.useEffect(() => {
    userService.getOne(loginContext.userName).then((user: UserInfos) => {
      setUserInfos(user);
    });

    socket.on("update-leaderboard", () => {

      userService.getOne(loginContext.userName).then((user: UserInfos) => {
        setUserInfos(user);
      });
    });
  }, []);

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

export default function Profile() {
  const loginContext = useLoginContext();

  if (loginContext.userName === null) return <DockGuest />;
  return (
    <div className={styles.profile}>
      <MyAccountDetails />
      <UserStats />
      <ButtonLogout />
    </div>
  );
}
