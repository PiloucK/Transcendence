import { useEffect } from "react";
import { Dock } from "./Dock";
import authService from "../../services/auth";

import { useSessionContext } from "../../context/SessionContext";

import Link from "next/link";
import { IconButton, Tooltip } from "@mui/material";
import Image from "next/image";

import styles from "../../styles/Home.module.css";
import FTLogo from "../../public/42logo.png";

import Cookies from "js-cookie";

import { errorHandler } from "../../errors/errorHandler";

import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";

import { SecondFactorLogin } from "../Alerts/SecondFactorLogin";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export function DockGuest() {
  const sessionContext = useSessionContext();
  const errorContext = useErrorContext();
  const socketContext = useSocketContext();

  const authenticate = () => {
    if (Cookies.get(publicRuntimeConfig.ACCESSTOKEN_COOKIE_NAME)) {
      authService
        .getLoggedInUser()
        .then((userSelf) => {
          sessionContext.login?.(userSelf);
          socketContext.socket.emit("user:new", userSelf.login42);
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
        });
    }
  };

  useEffect(() => {
    authenticate();
  }, [sessionContext]);

  return (
    <>
      <Dock>
        <Link
          href={`http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.BACKEND_PORT}/auth`}
        >
          <Tooltip title="Login with your 42 account">
            <IconButton className={styles.icons} aria-label="Authentication">
              <Image src={FTLogo} alt="42 logo" layout={"fill"} />
            </IconButton>
          </Tooltip>
        </Link>
      </Dock>
      <SecondFactorLogin />
    </>
  );
}
