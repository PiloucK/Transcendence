import Link from "next/link";
import React, {
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatIcon from "@mui/icons-material/Chat";
import GroupIcon from "@mui/icons-material/Group";
import LeaderboardIcon from "@mui/icons-material/EmojiEvents";
import GamemodeIcon from "@mui/icons-material/SportsEsports";
import CheckIcon from "@mui/icons-material/Check";

import { Dock } from "./Dock";
import styles from "../../styles/Home.module.css";
import { useSessionContext } from "../../context/SessionContext";

import userService from "../../services/user";
import authService from "../../services/auth";
import { IUserSelf } from "../../interfaces/IUser";
import { Button, TextField, Tooltip } from "@mui/material";

import { errorHandler } from "../../errors/errorHandler";

import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";

function NavigationDock({
  setIsInNavigation,
}: {
  setIsInNavigation: (mode: boolean) => void;
}) {
  const sessionContext = useSessionContext();
  const errorContext = useErrorContext();
  const socketContext = useSocketContext();

  const [login42, setLogin42] = useState("");

  const addUser: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    userService
      .addOne(login42)
      .then((user: IUserSelf) => {
        sessionContext.login?.(user);
        socketContext.socket.emit("user:new");
        setLogin42("");

        authService
          .getToken(login42)
          .then((login42: string) => {
            console.log("new token for", login42, "stored in cookie");
            sessionContext.updateUserSelf?.();
          })
          .catch((error) => {
            errorContext.newError?.(errorHandler(error, sessionContext));
          });
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });
  };

  const deleteAllUsers = () => {
    userService
      .deleteAll()
      .then(() => {
        console.log("all users deleted");
        sessionContext.logout?.();
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });
  };

  const handleLogin42Change: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.target.value) {
      setLogin42(event.target.value);
    }
  };

  return (
    <>
      <Dock>
        <Link href="/profile">
          <Tooltip title="Profile">
            <IconButton className={styles.icons} aria-label="profile">
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>
        </Link>

        <Link href="/chat">
          <Tooltip title="Chat">
            <IconButton className={styles.icons} aria-label="chat">
              <ChatIcon />
            </IconButton>
          </Tooltip>
        </Link>

        <Link href="/social">
          <Tooltip title="Friends">
            <IconButton className={styles.icons} aria-label="social">
              <GroupIcon />
            </IconButton>
          </Tooltip>
        </Link>

        <Link href="/leaderboard">
          <Tooltip title="Leaderboard">
            <IconButton className={styles.icons} aria-label="leaderboard">
              <LeaderboardIcon />
            </IconButton>
          </Tooltip>
        </Link>

        <Tooltip title="Game mode">
          <IconButton
            onClick={() => setIsInNavigation(false)}
            className={styles.icons}
            aria-label="gamemode"
          >
            <GamemodeIcon />
          </IconButton>
        </Tooltip>
      </Dock>

      <div>
        <form onSubmit={addUser}>
          <TextField
            value={login42}
            onChange={handleLogin42Change}
            label="Login"
          />
          <Button type="submit">add</Button>
        </form>
        <Button onClick={deleteAllUsers}>remove all users and logout</Button>
      </div>
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
