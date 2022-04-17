import { ReactElement, useEffect, useState } from "react";

import styles from "../styles/Home.module.css";
import userService from "../services/users";

enum UserStatus {
  IS_GUEST = "IS_GUEST",
  IS_42API = "IS_42API",
}

interface User {
  id: string;
  login: string;
  password: string;
  status: UserStatus;
  level: number;
  ranking: number;
  gamesWin: number;
  gamesLost: number;
  twoFa: boolean;
}

// Will create the five cards component to display the users and their scores.
function createLeaderboard(users: User[]): ReactElement {
  // console.log(users);
  return (
    <div className={styles.leaderboard}>
      {users.map((user, index) => {
        return (
          <div className={styles.leaderboard_user} key={index}>
            <div className={styles.leaderboard_user_rank}>{index + 1}</div>
            <div className={styles.leaderboard_user_name}>{user.login}</div>
            <div className={styles.leaderboard_user_score}>{user.ranking}</div>
          </div>
        );
      })}
    </div>
  );
}

// Will print the list of users in the leaderboard.
export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  // const bestUsers = takeBestUsers(allUsers);
  useEffect(() => {
    userService
      .getAll()
      .then((users) => {
        setUsers(users);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  return (
    <>
      <div className={styles.leaderboard_background}>
        <div className={styles.leaderboard_title}>LEADERBOARD</div>
        {createLeaderboard(users)}
      </div>
    </>
  );
}
