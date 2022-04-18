import { ReactElement, useEffect, useState } from "react";

import styles from "../styles/Home.module.css";
import userService from "../services/users";

import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";

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

// Will display a button incrementing the user's ranking.
function IncrementRankingButton({
  currentUser,
}: {
  currentUser: User;
}): ReactElement {
  const firstUserRanking = currentUser.ranking;
  return (
    <IconButton
      className={styles.icons}
      aria-label="ranking"
      onClick={() => {
        console.log("IncrementRankingButton", firstUserRanking);
        userService.updateUserRanking(currentUser.login, firstUserRanking + 15)
				.catch((e) => {
					console.error(e);
				});
      }}
    >
      <AddBoxIcon />
    </IconButton>
  );
}

// Will display a button decrementing the user's ranking.
function DecrementRankingButton({
  currentUser,
}: {
  currentUser: User;
}): ReactElement {
  const firstUserRanking = currentUser.ranking;
  return (
    <IconButton
      className={styles.icons}
      aria-label="ranking"
      onClick={() => {
        console.log("DecrementRankingButton", firstUserRanking);
        userService.updateUserRanking(currentUser.login, firstUserRanking - 15);
      }}
    >
      <IndeterminateCheckBoxIcon />
    </IconButton>
  );
}

// Will create the five cards component to display the users and their scores.
function createLeaderboard(users: User[]): ReactElement {
  // console.log(users);
  return (
    <div className={styles.leaderboard}>
      {users.map((user, index) => {
        return (
          <div className={styles.leaderboard_user} key={index}>
            <DecrementRankingButton currentUser={user} />
            <div className={styles.leaderboard_user_rank}>{index + 1}</div>
            <div className={styles.leaderboard_user_name}>{user.login}</div>
            <div className={styles.leaderboard_user_score}>{user.ranking}</div>
            <IncrementRankingButton currentUser={user} />
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
