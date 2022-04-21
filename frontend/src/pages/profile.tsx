import { ToggleDarkMode } from "../hooks/ToggleDarkMode";
import { ButtonLogout } from "../components/Buttons/ButtonLogout";
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

const socket = io("http://localhost:3003", {transports: ['websocket']});

function UserName() {
  const loginContext = useLoginContext();
  const [isInModification, setIsInModification] = useState(false);
  const [tmpUsername, setTmpUsername] = useState("");

  const changeUsername: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setIsInModification(false);

    if (tmpUsername !== "") {
      userService
        .changeUsername(loginContext.userName, tmpUsername)
        .then(() => {
          loginContext.login(tmpUsername, loginContext.userSecret);
          setTmpUsername("");
					socket.emit("usernameChange");
          //Emit on the socket here.
        })
        .catch((e) => {
          console.error(e);
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
      <div className={styles.profile_user_username}>
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
      <div className={styles.profile_user_username}>
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

export default function Profile() {
  return (
    <div className={styles.profile_user_stats}>
      <UserName />
      <ToggleDarkMode />
      <ButtonLogout />
    </div>
  );
}
