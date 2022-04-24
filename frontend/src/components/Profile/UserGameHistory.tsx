import Image from "next/image";
import emptyHistory from "../../public/sword-cross.png";
import styles from "../../styles/Home.module.css";

export function UserGameHistory({ userLogin }: { userLogin: string }) {
  return (
    <div className={styles.profile_history}>
      <div className={styles.profile_history_title}>Game history</div>
      <div className={styles.profile_history_content}>
        <Image src={emptyHistory} />
				Start playing and show your strength !
			</div>
    </div>
  );
}