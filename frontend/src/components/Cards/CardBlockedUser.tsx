import styles from "../../styles/Home.module.css";
import { IUserSlim } from "../../interfaces/IUser";
import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import { ButtonUnblock } from "../Buttons/ButtonUnblock";
import { defaultSessionState } from "../../constants/defaultSessionState";

export function CardBlockedUser({ userInfos }: { userInfos: IUserSlim }) {
  return (
    <div className={styles.social_friend_card} key={userInfos.login42}>
      <Link href={`/profile?login=${userInfos.login42}`}>
        <div className={styles.social_friend_card_avatar}>
          <Avatar
            src={userInfos.image}
            alt="avatar"
            sx={{ width: 60, height: 60 }}
          >
            <Avatar
              src={userInfos.photo42}
              alt="avatar"
              sx={{ width: 60, height: 60 }}
            />
          </Avatar>
        </div>
      </Link>
      <div className={styles.social_friend_card_username}>
        {userInfos.username  ?? defaultSessionState.userSelf.username}
      </div>
      <div className={styles.social_friend_card_elo}>Elo: {userInfos.elo}</div>
      <ButtonUnblock displayedUser={userInfos} />
    </div>
  );
}
