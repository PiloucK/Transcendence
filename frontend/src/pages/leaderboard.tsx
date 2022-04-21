import { ReactElement, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import userService from "../services/users";
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";

import io from "socket.io-client";

const socket = io("http://localhost:3003", {transports: ['websocket']});

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
  return (
    <IconButton
      className={styles.icons}
      aria-label="ranking"
      onClick={() => {
        userService.updateUserRanking(currentUser.login, 15)
				.catch((e) => {
					console.error(e);
				});
        socket.emit("newRank")
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
  return (
    <IconButton
      className={styles.icons}
      aria-label="ranking"
      onClick={() => {
        userService.updateUserRanking(currentUser.login, -15);
        socket.emit("newRank");
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

  useEffect(() => {
    userService.getAll().then((users) => {
      setUsers(users);
    });

		socket.on("leaderboardUpdate", () => {
			// console.log("udpate");

			userService.getAll().then((users) => {
				setUsers(users);
			});
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
