import { ReactElement, useState } from "react";
import Dock from "./Dock";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import IUserCredentials from "../../interfaces/IUserCredentials";
import userService from "../../services/users";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function DockGuest() {
  const [username, setUsername] = useState("");

  const addUser = (event) => {
    event.preventDefault();
    const newUserCredentials: IUserCredentials = {
      login: username,
      secret: "",
    };
    userService.add(newUserCredentials).then((returnedUser) => {
      console.log(returnedUser);
      setUsername("");
    });
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
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
