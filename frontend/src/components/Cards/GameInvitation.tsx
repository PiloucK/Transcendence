import styles from "../../styles/Home.module.css";
import { IUserSelf, IUserSlim } from "../../interfaces/IUser";
import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import { Match } from "../../interfaces/match";
import { useSessionContext } from "../../context/SessionContext";

function CardInviteInGame({ userInfo }: { userInfo: IUserSelf }) {
  const acceptInvitation = () => {};

  const declineInvitation = () => {};

  return (
    <div className={styles.invite_card}>
      <div className={styles.avatar}>
        <Link href={`/profile?login=${userInfo.login42}`}>
          <Avatar
            src={userInfo.image}
            alt="avatar"
            sx={{
              left: "50%",
              transform: "translateX(-50%)",
              width: 80,
              height: 80,
              cursor: "pointer",
            }}
          >
            <Avatar
              src={userInfo.photo42}
              alt="avatar"
              sx={{
                left: "50%",
                transform: "translateX(-50%)",
                width: 80,
                height: 80,
                cursor: "pointer",
              }}
            />
          </Avatar>
        </Link>
      </div>
      <div className={styles.text}>{userInfo.username}</div>
      <div className={styles.confirm} onClick={acceptInvitation}>
        Confirm
      </div>
      <div className={styles.decline} onClick={declineInvitation}>
        Decline
      </div>
    </div>
  );
}

export function GameInvitation() {
  const sessionContext = useSessionContext();
  const invitations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  return (
    <div className={styles.invite_card_box}>
      {invitations.map((index) => (
        <CardInviteInGame key={index} userInfo={sessionContext.userSelf} />
      ))}
    </div>
  );
}
