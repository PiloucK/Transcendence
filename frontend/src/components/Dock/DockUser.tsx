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
import Filter1Icon from "@mui/icons-material/Filter1";
import Filter2Icon from "@mui/icons-material/Filter2";
import Filter3Icon from "@mui/icons-material/Filter3";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';

import { Dock } from "./Dock";
import styles from "../../styles/Home.module.css";
import { useLoginContext } from "../../context/LoginContext";

import userService from "../../services/user";
import authService from "../../services/auth";
import { IUser, IUserCredentials } from "../../interfaces/users";
import { Button, TextField, Tooltip } from "@mui/material";

import { errorHandler } from "../../errors/errorHandler";

import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";

function NavigationDock({
  setIsInNavigation,
}: {
  setIsInNavigation: (mode: boolean) => void;
}) {
  const loginContext = useLoginContext();
  const errorContext = useErrorContext();
  const socketContext = useSocketContext();

  const [username, setUsername] = useState("");

  const addUser: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const newUserCredentials: IUserCredentials = {
      login42: username,
      photo42: "https://cdn.intra.42.fr/users/chdespon.jpg",
    };

    userService
      .addOne(newUserCredentials)
      .then((user: IUser) => {
        loginContext.login?.(user.login42);
        socketContext.socket.emit("user:new", username);
        setUsername("");

        authService
          .getToken(newUserCredentials.login42)
          .then((login42: string) => {
            console.log("new token for", login42, "stored in cookie");
          })
          .catch((error) => {
            errorContext.newError?.(errorHandler(error, loginContext));
            // errorContext.newError(errorParse)
          });
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, loginContext));
      });
  };

  const deleteAllUsers = () => {
    userService
      .deleteAll()
      .then(() => {
        console.log("all users deleted");
        loginContext.logout?.();
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, loginContext));
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

        <Tooltip title="Practice mode">
          <IconButton
            onClick={() => setIsInNavigation(false)}
            className={styles.icons}
            aria-label="practicemode"
          >
            <PrecisionManufacturingIcon />
          </IconButton>
        </Tooltip>
      </Dock>

      <div>
        <form onSubmit={addUser}>
          <TextField
            value={username}
            onChange={handleUsernameChange}
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
      <Tooltip title="Go back">
        <IconButton
          onClick={() => setIsInNavigation(true)}
          className={styles.icons}
          aria-label="Go back"
        >
          <ArrowBackIosNewIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Dificulty: easy">
        <IconButton
          onClick={() => setIsInNavigation(true)}
          className={styles.icons}
          aria-label="Easy"
        >
          <Filter1Icon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Dificulty: medium">
        <IconButton
          onClick={() => setIsInNavigation(true)}
          className={styles.icons}
          aria-label="Medium"
        >
          <Filter2Icon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Dificulty: hard">
        <IconButton
          onClick={() => setIsInNavigation(true)}
          className={styles.icons}
          aria-label="Hard"
        >
          <Filter3Icon />
        </IconButton>
      </Tooltip>
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
