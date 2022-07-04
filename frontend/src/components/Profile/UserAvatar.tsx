import { Avatar } from "@mui/material";
import { IUserPublic } from "../../interfaces/IUser";
import styles from "../../styles/Home.module.css";

export function UserAvatar({ displayedUser }: { displayedUser: IUserPublic }) {
  return (
    <div className={styles.profile_user_account_details_avatar}>
      <Avatar
        src={displayedUser.image}
        alt="avatar"
        sx={{ width: 151, height: 151 }}
      >
        <Avatar
          src={displayedUser.photo42}
          alt="avatar"
          sx={{ width: 151, height: 151 }}
        />
      </Avatar>
    </div>
  );
}
