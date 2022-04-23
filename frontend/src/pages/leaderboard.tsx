import { ReactElement, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import userService from "../services/users";
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";

import Link from "next/link";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

interface User {
  username: string;
  elo: number;
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
        userService.updateUserRanking(currentUser.login, 15);
        socket.emit("user:update-elo");
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
        userService.updateUserRanking(currentUser.username, -15);
        socket.emit("user:update-elo");
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
          <Link href={`/publicprofile?login=${user.username}`} key={index}>
            <div className={styles.leaderboard_user} key={index}>
              <DecrementRankingButton currentUser={user} />
              <div className={styles.leaderboard_user_rank}>{index + 1}</div>
              <div className={styles.leaderboard_user_name}>{user.username}</div>
              <div className={styles.leaderboard_user_score}>
                {user.elo}
              </div>
              <IncrementRankingButton currentUser={user} />
            </div>
          </Link>
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

    socket.on("leaderboard-update", () => {
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
