import { ButtonLogout } from "../components/Buttons/ButtonLogout";
import styles from "../styles/Home.module.css";
import { useSessionContext } from "../context/SessionContext";
import Router, { useRouter } from "next/router";
import { UserGameHistory } from "../components/Profile/UserGameHistory";
import { useErrorContext } from "../context/ErrorContext";
import { errorHandler } from "../errors/errorHandler";
import userService from "../services/user";
import { AxiosError } from "axios";
import { ProfileInteractions } from "../components/Profile/ProfileInteractions";
import { UserStats } from "../components/Profile/UserStats";
import { AccountDetails } from "../components/Profile/AccountDetails";
import { ReactElement, useEffect, useRef, useState } from "react";
// import { useSocketContext } from "../context/SocketContext";
import { defaultSessionState } from "../constants/defaultSessionState";
import { ProfileSettingsDialog } from "../components/Inputs/ProfileSettingsDialog";
import {
  UserStatusLayout,
  useUserStatusContext,
} from "../layouts/userStatusLayout";
import { DefaultLayout } from "../layouts/defaultLayout";

// const DisplayStatuses = ({
//   statuses,
// }: {
//   statuses: Map<Login42, StatusMetrics>;
// }) => {
// const iterator =
// statuses.forEach((value, key) => {console.log(value, key)})

//   return (
//     <>
//       <p>statuses:</p>
//       {/* <p>{iterator.next().value}</p> */}
//     </>
//   );
// };

export default function ProfilePage() {
  const { login } = useRouter().query;
  const sessionContext = useSessionContext();
  // const socketContext = useSocketContext();
  const errorContext = useErrorContext();
  const [displayedUser, setDisplayedUser] = useState(
    defaultSessionState.userSelf
  );
  const [open, setOpen] = useState(false);

  const statuses = useUserStatusContext();

  const fetchDisplayedUser = async () => {
    if (login !== undefined && login !== sessionContext.userSelf.login42) {
      const user = await userService
        .getOne(login)
        .catch((error: Error | AxiosError<unknown, any>) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
          Router.push("/");
          return <></>;
        });
      setDisplayedUser(user);
    } else {
      setDisplayedUser(sessionContext.userSelf);
    }
  };

  useEffect(() => {
    fetchDisplayedUser();
  }, [sessionContext]);

  if (statuses.size !== 0) {
    console.log(statuses);
  }
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
          <ProfileInteractions
            userSelf={sessionContext.userSelf}
            displayedUser={displayedUser}
            userStatus={statuses.get(displayedUser.login42)}
          />
        ) : (
          <>
            <ButtonLogout />
            <ProfileSettingsDialog
              user={displayedUser}
              open={open}
              setOpen={setOpen}
            />
          </>
        )}
        {/* <UserStatusContext.Consumer>
          {(statuses) => <DisplayStatuses statuses={statuses} />}
        </UserStatusContext.Consumer> */}
      </div>
      <UserGameHistory userLogin={sessionContext.userSelf.login42} />
    </>
  );
}

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DefaultLayout>
      <UserStatusLayout>{page}</UserStatusLayout>
    </DefaultLayout>
  );
};
