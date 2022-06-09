import { useEffect, useRef } from "react";
import { Dock } from "./Dock";
import authService from "../../services/auth";

import { useLoginContext } from "../../context/LoginContext";

import Link from "next/link";
import { IconButton } from "@mui/material";
import Image from "next/image";

import styles from "../../styles/Home.module.css";
import FTLogo from "../../public/42logo.png";

import Cookies from "js-cookie";

import { errorHandler } from "../../errors/errorHandler";

import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";

import getConfig from "next/config";
import { HttpStatusCodes } from "../../constants/httpStatusCodes";
const { publicRuntimeConfig } = getConfig();

export function DockGuest() {
  const loginContext = useLoginContext();
  const errorContext = useErrorContext();
  const socketContext = useSocketContext();
  const isLogged = useRef(false);

  const authenticate = () => {
    if (Cookies.get(publicRuntimeConfig.ACCESSTOKEN_COOKIE_NAME)) {
      authService
        .getLoggedInUser()
        .then((user) => {
          loginContext.login?.(user.login42);
          socketContext.socket.emit("user:new", user.login42);
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, loginContext));
        });
    }
  };

  useEffect(() => {
    if (isLogged.current === false) {
      isLogged.current = true;
      authenticate();
    }
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
