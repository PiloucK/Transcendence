import styles from "../../styles/Home.module.css";
import { IUserSelf, IUserSlim } from "../../interfaces/IUser";
import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import { Match } from "../../interfaces/match";

function CardInviteInGame() {
  return <div className={styles.invite_card}>You received an invitation</div>;
}

export function GameInvitation() {
  const invitations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  return (
    <div className={styles.invite_card_box}>
      {invitations.map((index) => (
        <CardInviteInGame key={index} />
      ))}
    </div>
  );
}
