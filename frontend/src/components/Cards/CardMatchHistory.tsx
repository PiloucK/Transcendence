import styles from "../../styles/Home.module.css";
import { IUserSelf, IUserSlim } from "../../interfaces/IUser";
import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import { Match } from "../../interfaces/match";

interface summary {
  self: IUserSelf;
  points: number;
}

export function CardMatchHistory({
  match,
  userLogin,
}: {
  match: Match;
  userLogin: string;
}) {
  const player: summary =
    match.user1.login42 === userLogin
      ? { self: match.user1, points: match.user1Points }
      : { self: match.user2, points: match.user2Points };
  const opponent: summary =
    match.user1.login42 === userLogin
      ? { self: match.user2, points: match.user2Points }
      : { self: match.user1, points: match.user1Points };

  const getStyle = () => {
    if (player.points >= opponent.points)
      return styles.profile_history_card_victory;
    else return styles.profile_history_card_defeat;
  };

  return (
    <div className={getStyle()}>
      <div className={styles.score_player}>{player.points}</div>
      {player.points >= opponent.points ? (
        <div className={styles.result_text}>Victory</div>
      ) : (
        <div className={styles.result_text}>Defeat</div>
      )}
      <div className={styles.score_opponent}>{opponent.points}</div>
      <div className={styles.opponent_avatar}>
        <Link href={`/profile?login=${opponent.self.login42}`}>
          <Avatar
            src={opponent.self.image}
            alt="avatar"
            sx={{
              left: "50%",
              transform: "translateX(-50%)",
              width: 100,
              height: 100,
              cursor: "pointer",
            }}
          >
            <Avatar
              src={opponent.self.photo42}
              alt="avatar"
              sx={{
                left: "50%",
                transform: "translateX(-50%)",
                width: 100,
                height: 100,
                cursor: "pointer",
              }}
            />
          </Avatar>
        </Link>
      </div>
      <div className={styles.opponent_name}>{opponent.self.username}</div>
    </div>
  );
}
