import styles from "../../styles/Home.module.css";
import { IUserSlim } from "../../interfaces/IUser";
import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import { ButtonUnblock } from "../Buttons/ButtonUnblock";
import { defaultSessionState } from "../../constants/defaultSessionState";

export function CardMatchHistory({
  index,
  userInfos,
}: {
  index: number;
  userInfos: IUserSlim;
}) {
  const isAVictory = () => {
    if (index % 2 === 0) return styles.profile_history_card_victory;
    else return styles.profile_history_card_defeat;
  };
  return (
    <div className={isAVictory()}>
      <div className={styles.score_player}>1</div>
      {index % 2 === 0 ? (
        <div className={styles.result_text}>Victory</div>
      ) : (
        <div className={styles.result_text}>Defeat</div>
      )}
      <div className={styles.score_opponent}>5</div>
      <div className={styles.opponent_avatar}>
        <Link href={`/profile?login=${userInfos.login42}`}>
          <Avatar
            src={userInfos.image}
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
              src={userInfos.photo42}
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
      <div className={styles.opponent_name}>{userInfos.username}</div>
    </div>
  );
}
