import {FormEventHandler, ChangeEventHandler, ReactElement, useEffect, useState } from "react";
import {Dock} from "./Dock";
import {IUserCredentials} from "../../interfaces/IUserCredentials";
import userService from "../../services/users";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import io from "socket.io-client";

const socket = io("http://localhost:3003", {transports: ['websocket']});

export function DockGuest() {
  const [username, setUsername] = useState("");

  const addUser: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const newUserCredentials: IUserCredentials = {
      login: username,
      password: "",
    };
    
    userService
      .add(newUserCredentials)
      .then(() => {
        socket.emit("newName", username);
        setUsername("");
      })
      .catch((e) => {
        console.error(e);
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
