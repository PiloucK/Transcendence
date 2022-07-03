import { Dock } from "./Dock";
import Link from "next/link";
import { IconButton, Tooltip } from "@mui/material";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import FTLogo from "../../public/42logo.png";
import getConfig from "next/config";
import userService from "../../services/user";
import authService from "../../services/auth";
import { useSessionContext } from "../../context/SessionContext";
import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";
import { IUserSelf } from "../../interfaces/IUser";
import { Button } from "@mui/material";
import { errorHandler } from "../../errors/errorHandler";

const { publicRuntimeConfig } = getConfig();

export function DockGuest() {
  const sessionContext = useSessionContext();
  const errorContext = useErrorContext();
  const socketContext = useSocketContext();

  const addUser = () => {
    userService
      .addOne("coucou")
      .then((user: IUserSelf) => {
        sessionContext.login?.(user);
        socketContext.socket.emit("user:new");

        authService
          .getToken("coucou")
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

  return (
    <>
      <Dock>
        <Link
          href={`http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/auth`}
        >
          <Tooltip title="Login with your 42 account">
            <IconButton className={styles.icons} aria-label="Authentication">
              <Image src={FTLogo} alt="42 logo" layout={"fill"} />
            </IconButton>
          </Tooltip>
        </Link>
        <Button onClick={addUser}>create coucou</Button>
      </Dock>
    </>
  );
}
