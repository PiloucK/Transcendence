import { defaultSessionState } from "../../constants/defaultSessionState";
import { IUserPublic } from "../../interfaces/IUser";
import styles from "../../styles/Home.module.css";

export function UserName({ displayedUser }: { displayedUser: IUserPublic }) {
  return (
    <div className={styles.profile_user_account_details_username}>
      {displayedUser.username ?? defaultSessionState.userSelf.username}
    </div>
  );
}
