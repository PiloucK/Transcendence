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
import { ReactElement, useEffect, useState } from "react";
import { defaultSessionState } from "../constants/defaultSessionState";
import { ProfileSettingsDialog } from "../components/Inputs/ProfileSettingsDialog";
import { UserStatusLayout } from "../layouts/userStatusLayout";
import { DefaultLayout } from "../layouts/defaultLayout";
import CircularProgress from "@mui/material/CircularProgress";

export default function ProfilePage() {
  const { login } = useRouter().query;
  const sessionContext = useSessionContext();
  const errorContext = useErrorContext();
  const [displayedUser, setDisplayedUser] = useState(
    defaultSessionState.userSelf
  );
  const [open, setOpen] = useState(false);

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

  if (
    sessionContext.userSelf.login42 === defaultSessionState.userSelf.login42 ||
    displayedUser.login42 === defaultSessionState.userSelf.login42
  ) {
    return (
      <div className={styles.play}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <div className={styles.profile_user}>
        <AccountDetails displayedUser={displayedUser} />
        <UserStats displayedUser={displayedUser} />
        {login !== undefined && login !== sessionContext.userSelf.login42 ? (
          <ProfileInteractions displayedUser={displayedUser} />
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
