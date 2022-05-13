import Link from "next/link";
import React, { ChangeEventHandler, FormEventHandler, useState } from "react";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatIcon from "@mui/icons-material/Chat";
import GroupIcon from "@mui/icons-material/Group";
import LeaderboardIcon from "@mui/icons-material/EmojiEvents";
import GamemodeIcon from "@mui/icons-material/SportsEsports";
import CheckIcon from "@mui/icons-material/Check";

import { Dock } from "./Dock";
import styles from "../../styles/Home.module.css";
import { useLoginContext } from "../../context/LoginContext";

import usersService from "../../services/users";
import io from "socket.io-client";
import { IUser, IUserCredentials } from "../../interfaces/users";
import { Button, TextField } from "@mui/material";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig()
const socket = io(`http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.WEBSOCKETS_PORT}`, { transports: ["websocket"] });

function NavigationDock({
  setIsInNavigation,
}: {
  setIsInNavigation: (mode: boolean) => void;
}) {
  const loginContext = useLoginContext();

  const [username, setUsername] = useState("");

  const addUser: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const newUserCredentials: IUserCredentials = {
      login42: username,
    };

    usersService.addOne(newUserCredentials).then((user: IUser) => {
      loginContext.login(user.login42, "");
      socket.emit("user:new", username);
      setUsername("");
    });
  };

  const handleUsernameChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.target.value) {
      setUsername(event.target.value);
    }
  };

  return (
    <>
      <Dock>
        <Link href="/profile">
          <IconButton className={styles.icons} aria-label="profile">
            <AccountCircleIcon />
          </IconButton>
        </Link>

        <Link href="/chat">
          <IconButton className={styles.icons} aria-label="chat">
            <ChatIcon />
          </IconButton>
        </Link>

        <Link href="/social">
          <IconButton className={styles.icons} aria-label="social">
            <GroupIcon />
          </IconButton>
        </Link>

        <Link href="/leaderboard">
          <IconButton className={styles.icons} aria-label="leaderboard">
            <LeaderboardIcon />
          </IconButton>
        </Link>

        <IconButton
          onClick={() => setIsInNavigation(false)}
          className={styles.icons}
          aria-label="gamemode"
        >
          <GamemodeIcon />
        </IconButton>
      </Dock>

      <Dock>
        <form onSubmit={addUser}>
          <TextField
            value={username}
            onChange={handleUsernameChange}
            label="Login"
          />
          <Button type="submit">add</Button>
        </form>
      </Dock>
    </>
  );
}

function GamemodeDock({
  setIsInNavigation,
}: {
  setIsInNavigation: (mode: boolean) => void;
}) {
  return (
    <Dock>
      <IconButton
        onClick={() => setIsInNavigation(true)}
        className={styles.icons}
        aria-label="gamemode"
      >
        <CheckIcon />
      </IconButton>
    </Dock>
  );
}

export function DockUser() {
  const [isInNavigation, setIsInNavigation] = React.useState(true);

  if (isInNavigation) {
    return <NavigationDock setIsInNavigation={setIsInNavigation} />;
  } else {
    return <GamemodeDock setIsInNavigation={setIsInNavigation} />;
  }
}
