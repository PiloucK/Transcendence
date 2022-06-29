import { IUserPublic } from "../../interfaces/IUser";
import styles from "../../styles/Home.module.css";

export function UserStats({ displayedUser }: { displayedUser: IUserPublic }) {
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
