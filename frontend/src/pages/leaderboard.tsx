import { ReactElement, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import userService from "../services/user";
import { IUserForLeaderboard } from "../interfaces/users";

import Link from "next/link";

import io from "socket.io-client";

import { errorParser } from "../services/parsing/errorParser";

import getConfig from "next/config";
import { useErrorContext } from "../context/ErrorContext";
const { publicRuntimeConfig } = getConfig();
const socket = io(
  `http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.WEBSOCKETS_PORT}`,
  { transports: ["websocket"] }
);

function LeaderboardUserCard(props: {
  user: IUserForLeaderboard;
  index: number;
}) {
  let userStyle = styles.leaderboard_user;
  if (props.index === 0) {
    userStyle = styles.leaderboard_firstuser;
  }

  return (
    <Link href={`/profile?login=${props.user.login42}`} key={props.index}>
      <div className={userStyle} key={props.index}>
        <div className={styles.leaderboard_user_rank}>{props.index + 1}</div>
        <div className={styles.leaderboard_user_name}>
          {props.user.username}
        </div>
        <div className={styles.leaderboard_user_score}>{props.user.elo}</div>
      </div>
    </Link>
  );
}
// Will create the five cards component to display the users and their scores.
function createLeaderboard(users: IUserForLeaderboard[]): ReactElement {
  // console.log(users);
  return (
    <div className={styles.leaderboard}>
      {users.map((user, index) => {
        return LeaderboardUserCard({ user, index });
      })}
    </div>
  );
}

// Will print the list of users in the leaderboard.
export default function Leaderboard() {
  const errorContext = useErrorContext();

  const [users, setUsers] = useState<IUserForLeaderboard[]>([]);

  useEffect(() => {
    userService
      .getAll()
      .then((users: IUserForLeaderboard[]) => {
        setUsers(users);
      })
      .catch((error) => {
        errorContext.newError?.(errorParser(error));
      });

    socket.on("update-leaderboard", () => {
      userService
        .getAll()
        .then((users: IUserForLeaderboard[]) => {
          setUsers(users);
        })
        .catch((error) => {
          errorContext.newError?.(errorParser(error));
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
