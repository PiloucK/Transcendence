import { useEffect } from "react";
import { Dock } from "./Dock";
import authService from "../../services/auth";

import { useLoginContext } from "../../context/LoginContext";

import io from "socket.io-client";
import Link from "next/link";
import { IconButton } from "@mui/material";
import Image from "next/image";

import styles from "../../styles/Home.module.css";
import FTLogo from "../../public/42logo.png";

import Cookies from "js-cookie";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

export function DockGuest() {
  const loginContext = useLoginContext();

  const authenticate = () => {
    if (Cookies.get("transcendence_accessToken")) {
      authService.getLoggedInUser().then((user) => {
        loginContext.login(user.login42, "");
        socket.emit("user:new", user.login42);
      });
    }
  };

  useEffect(() => {
    authenticate();
  }, []);

  // store 0.0.0.0 as an environment var in .env file
  return (
    <Dock>
      <Link href="http://0.0.0.0:3001/auth">
        <IconButton className={styles.icons} aria-label="Authentication">
          <Image src={FTLogo} layout={"fill"} />
        </IconButton>
      </Link>
    </Dock>
  );
}
