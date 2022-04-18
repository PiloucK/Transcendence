import { ReactElement, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import userService from "../services/users";
import io from "socket.io-client";

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

let socket;

// Will print the list of users in the leaderboard.
export default function Leaderboard() {
  const [users, setUsers] = useState([]);

	// const socket = io("ws://localhost:3003");

  // useEffect(() => {
	// 	// envoi d'un message au serveur
	// 	socket.emit("bonjour du client", 5, "6", { 7: Uint8Array.from([8]) });
		
	// 	// réception d'un message envoyé par le serveur
	// 	socket.on("update", (...args) => {
	// 		console.log(args);

	// 		userService.getAll().then((users) => {
	// 			setUsers(users);
	// 		});
	// 	});
		
  // }, []);

  useEffect(() => {
    async function socketFetch() {
      await fetch("/api/socket");
      socket = io();

      socket.on("connect", () => {
        console.log("connected");
        userService.getAll().then((users) => {
          setUsers(users);
        });
      });

			socket.on("update", (newUsername: string) => {
				console.log(newUsername);

				userService.getAll().then((users) => {
					setUsers(users);
				});
			});
    }
    socketFetch();
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
