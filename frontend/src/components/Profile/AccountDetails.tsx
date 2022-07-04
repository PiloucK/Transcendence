import { IUserPublic } from "../../interfaces/IUser";
import styles from "../../styles/Home.module.css";
import { UserAvatar } from "./UserAvatar";
import { UserName } from "./UserName";

export function AccountDetails({ displayedUser }: { displayedUser: IUserPublic }) {
  return (
    <div className={styles.profile_user_account_details}>
      <div className={styles.profile_user_account_details_title}>
        Account details
      </div>
      <UserAvatar displayedUser={displayedUser} />
      <UserName displayedUser={displayedUser} />
    </div>
  );
}
