import styles from "../../styles/Home.module.css";

import { IUserPublic } from "../../interfaces/IUser";
import { StatusMetrics } from "../../interfaces/status.types";

export function ButtonUserStatus({
  userStatus,
}: {
  userStatus: StatusMetrics | undefined;
}) {
  console.log("button", userStatus);

  if (userStatus?.status === "ONLINE" || userStatus?.status === "IN_QUEUE") {
    return (
      <div className={styles.social_friend_card_button} onClick={() => {}}>
        Defy
      </div>
    );
  } else if (userStatus?.status === "IN_GAME") {
    return (
      <div className={styles.social_friend_card_button} onClick={() => {}}>
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
