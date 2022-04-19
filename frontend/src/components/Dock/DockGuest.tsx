import { ReactElement, useEffect, useState } from "react";
import Dock from "./Dock";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import IUserCredentials from "../../interfaces/IUserCredentials";
import userService from "../../services/users";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import io from "socket.io-client";

const socket = io("http://localhost:3001", {transports: ['websocket']});

export default function DockGuest() {
  const [username, setUsername] = useState("");

  const addUser = (event) => {
    event.preventDefault();

    const newUserCredentials: IUserCredentials = {
      login: username,
      secret: "",
    };
    console.log(username);

    userService.add(newUserCredentials).then((returnedUser) => {
      console.log(returnedUser);
      socket.emit("newName", username);
      setUsername("");
    });
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  // useEffect(() => {
  //   async function socketFetch() {
  //     await fetch("/api/socket");
  //     socket = io();

  //     socket.on("connect", () => {
  //       console.log("dock connected");
  //     });
  //   }
  //   socketFetch();
  // }, []);

  return (
    <Dock>
      <form onSubmit={addUser}>
        <TextField
          value={username}
          onChange={handleUsernameChange}
          label="Username"
        />
        <Button type="submit">add</Button>
      </form>
    </Dock>
  );
}

// export default function DockGuest() {
// 	return (
// 	  <Dock>
// 		<IconButton className={styles.icons} aria-label="Authentification">
// 			<Image
// 				src = {FTLogo}
// 				layout = {'fill'}
// 			/>
// 		</IconButton>
// 	  </Dock>
// 	);
//   }
