import { ReactElement, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import userService from "../services/user";
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { IUserSlim } from "../interfaces/IUser";

import Link from "next/link";

import { errorHandler } from "../errors/errorHandler";
import { useSessionContext } from "../context/SessionContext";

import { useErrorContext } from "../context/ErrorContext";
import { useSocketContext } from "../context/SocketContext";
import { defaultSessionState } from "../constants/defaultSessionState";

function LeaderboardUserCard(props: { user: IUserSlim; index: number }) {
  let userStyle = styles.leaderboard_user;
  if (props.index === 0) {
    userStyle = styles.leaderboard_firstuser;
  }

  return (
    <Link href={`/profile?login=${props.user.login42}`} key={props.index}>
      <div className={userStyle} key={props.index}>
        <div className={styles.leaderboard_user_rank}>{props.index + 1}</div>
        <div className={styles.leaderboard_user_name}>
          {props.user.username ?? defaultSessionState.userSelf.username}
        </div>
        <div className={styles.leaderboard_user_score}>{props.user.elo}</div>
      </div>
    </Link>
  );
}

function createLeaderboard(users: IUserSlim[]): ReactElement {
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
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();

  const [users, setUsers] = useState<IUserSlim[]>([]);

  useEffect(() => {
    userService
      .getAllForLeaderboard()
      .then((users: IUserSlim[]) => {
        setUsers(users);
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });

    socketContext.socket.on("update-leaderboard", () => {
      userService
        .getAllForLeaderboard()
        .then((users: IUserSlim[]) => {
          setUsers(users);
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
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
