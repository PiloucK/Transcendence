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
import { Interactions } from "../components/Profile/publicprofile";

function UserAvatar({ displayedUser }: { displayedUser: IUserPublic }) {
  return (
    <div className={styles.profile_user_account_details_avatar}>
      <Avatar
        src={displayedUser.image}
        alt="avatar"
        sx={{ width: 151, height: 151 }}
      >
        <Avatar
          src={displayedUser.photo42}
          alt="avatar"
          sx={{ width: 151, height: 151 }}
        />
      </Avatar>
    </div>
  );
}

export function UserName({ displayedUser }: { displayedUser: IUserPublic }) {
  return (
    <div className={styles.profile_user_account_details_username}>
      {displayedUser.username}
    </div>
  );
}

function AccountDetails({ displayedUser }: { displayedUser: IUserPublic }) {
  return (
    <div className={styles.profile_user_account_details}>
      <div className={styles.profile_user_account_details_title}>
        Account details
      </div>
      <UserAvatar displayedUser={displayedUser} />
      <UserName displayedUser={displayedUser} />
    </div>
  );
}

function UserStats({ displayedUser }: { displayedUser: IUserPublic }) {
  return (
    <div className={styles.profile_user_stats}>
      <div className={styles.profile_user_stats_header}>
        <div className={styles.profile_user_stats_header_title}>Stats</div>
      </div>
      <div className={styles.profile_user_stats_elo}>
        Elo: {displayedUser.elo}
      </div>
      <div className={styles.profile_user_stats_games_summary}>
        Games won: {displayedUser.gamesWon}
        <br />
        Games lost: {displayedUser.gamesLost}
      </div>
    </div>
  );
}

export default async function ProfilePage() {
  const router = useRouter();
  const { login } = router.query;
  const sessionContext = useSessionContext();
  const errorContext = useErrorContext();
  let displayedUser: IUserPublic;

  if (login !== undefined && login !== sessionContext.userSelf.login42) {
    displayedUser = await userService
      .getOne(login)
      .catch((error: Error | AxiosError<unknown, any>) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });
  } else {
    displayedUser = sessionContext.userSelf;
  }

  return (
    <>
      <div className={styles.profile_user}>
        <AccountDetails displayedUser={displayedUser} />
        <UserStats displayedUser={displayedUser} />
        {login !== undefined && login !== sessionContext.userSelf.login42 ? (
          <Interactions displayedUser={displayedUser} />
        ) : (
          <ButtonLogout />
        )}
      </div>
      <UserGameHistory userLogin={sessionContext.userSelf.login42} />
    </>
  );
}
