import { ButtonLogout } from "../components/Buttons/ButtonLogout";
import styles from "../styles/Home.module.css";
import { useSessionContext } from "../context/SessionContext";
import { useRouter } from "next/router";
import { UserGameHistory } from "../components/Profile/UserGameHistory";
import { IUserPublic } from "../interfaces/IUser";
import { useErrorContext } from "../context/ErrorContext";
import { errorHandler } from "../errors/errorHandler";
import userService from "../services/user";
import { AxiosError } from "axios";
import { Interactions } from "../components/Profile/Interactions";
import { UserStats } from "../components/Profile/UserStats";
import { AccountDetails } from "../components/Profile/AccountDetails";
import { useEffect, useState } from "react";
import { useSocketContext } from "../context/SocketContext";
import { defaultSessionState } from "../constants/defaultSessionState";

export default function ProfilePage() {
  const router = useRouter();
  const { login } = router.query;
  const sessionContext = useSessionContext();
  // const socketContext = useSocketContext();
  const errorContext = useErrorContext();
  const [displayedUser, setDisplayedUser] = useState(
    defaultSessionState.userSelf
  );

  useEffect(() => {
    if (login !== undefined && login !== sessionContext.userSelf.login42) {
      userService
        .getOne(login)
        .then((user) => {
          setDisplayedUser(user);
        })
        .catch((error: Error | AxiosError<unknown, any>) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
          // return <div>User not found</div>;
        });
    } else {
      setDisplayedUser(sessionContext.userSelf);
    }
  }, []);

  // useEffect(() => {
  //   socketContext.socket.on("update-leaderboard", () => {
  //     userService
  //       .getOne(state.usrInfo.username)
  //       .then((user: IUserPublic) => {
  //         state.setUsrInfo(user);
  //       })
  //       .catch((error) => {
  //         errorContext.newError?.(errorHandler(error, sessionContext));
  //       });
  //   });
  // }, []);

  return (
    <>
      <div className={styles.profile_user}>
        <AccountDetails displayedUser={displayedUser} />
        <UserStats displayedUser={displayedUser} />
        {login !== undefined && login !== sessionContext.userSelf.login42 ? (
          <Interactions
            userSelf={sessionContext.userSelf}
            displayedUser={displayedUser}
          />
        ) : (
          <ButtonLogout />
        )}
      </div>
      <UserGameHistory userLogin={sessionContext.userSelf.login42} />
    </>
  );
}
