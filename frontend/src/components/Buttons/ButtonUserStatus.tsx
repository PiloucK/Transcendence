import styles from "../../styles/Home.module.css";
import { IUserSlim } from "../../interfaces/IUser";
import { useUserStatusContext } from "../../context/UserStatusContext";
import Router from "next/router";

export function ButtonUserStatus({
  displayedUser,
}: {
  displayedUser: IUserSlim;
}) {
  const userStatusContext = useUserStatusContext();
  const userStatus = userStatusContext.statuses.get(displayedUser.login42);

  if (userStatus?.status === "ONLINE" || userStatus?.status === "IN_QUEUE") {
    return (
      <div className={styles.social_friend_card_button} onClick={() => {}}>
        Defy
      </div>
    );
  } else if (userStatus?.status === "IN_GAME") {
    return (
      <div
        className={styles.social_friend_card_button}
        onClick={() => {
          Router.push({
            pathname: "/game",
            query: {
              userLogin42: displayedUser.login42,
              opponentLogin42: userStatus.opponentLogin42,
            },
          });
        }}
      >
        Spectate
      </div>
    );
  } else {
    return (
      <div className={styles.offline_button} onClick={() => {}}>
        Offline
      </div>
    );
  }
}
