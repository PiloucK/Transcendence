import styles from "../../styles/Home.module.css";

import { IUserPublic } from "../../interfaces/IUser";
import { StatusMetrics } from "../../interfaces/status.types";

export function ButtonUserStatus({
  userStatus,
}: {
  userStatus: StatusMetrics;
}) {
  if (!userStatus || userStatus.status === "OFFLINE") {
    return (
      <div className={styles.offline_button} onClick={() => {}}>
        Offline
      </div>
    );
  } else if (userStatus.status === "ONLINE") {
    return (
      <div className={styles.social_friend_card_button} onClick={() => {}}>
        Defy
      </div>
    );
    // } else if (userInfos.online === true) {
    //   return (
    //     <div className={styles.social_friend_card_button} onClick={() => {}}>
    //       Spectate
    //     </div>
    //   );
  }
}
