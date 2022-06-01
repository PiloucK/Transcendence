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

import { errorParser } from "../../services/errorParser";

import getConfig from "next/config";
import { useErrorContext } from "../../context/ErrorContext";
const { publicRuntimeConfig } = getConfig();
const socket = io(
  `http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.WEBSOCKETS_PORT}`,
  { transports: ["websocket"] }
);

export function DockGuest() {
  const loginContext = useLoginContext();
  const errorContext = useErrorContext();

  const authenticate = () => {
    if (Cookies.get(publicRuntimeConfig.ACCESSTOKEN_COOKIE_NAME)) {
      authService
        .getLoggedInUser()
        .then((user) => {
          loginContext.login?.(user.login42, "");
          socket.emit("user:new", user.login42);
        })
        .catch((error) => {
          errorContext.newError?.(errorParser(error));
        });
    }
  };

  useEffect(() => {
    authenticate();
  }, []);

  return (
    <Dock>
      <Link
        href={`http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.BACKEND_PORT}/auth`}
      >
        <IconButton className={styles.icons} aria-label="Authentication">
          <Image src={FTLogo} layout={"fill"} />
        </IconButton>
      </Link>
    </Dock>
  );
}
