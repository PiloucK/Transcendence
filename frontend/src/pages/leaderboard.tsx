import { ReactElement } from "react";
import MainLayout from "../layouts/mainLayout";
import styles from '../styles/Home.module.css'

interface LocalUser {
	id: string;
	name: string;
	score: number;
}

// Will create the five cards component to display the users and their scores.
function createLeaderboard(users: LocalUser[]): ReactElement {
	return (
		<div className={styles.leaderboard}>
			{users.map((user, index) => {
				return (
					<div className={styles.leaderboard_user} key={index}>
						<div className={styles.leaderboard_user_rank}>
							{index + 1}
						</div>
						<div className={styles.leaderboard_user_name}>
							{user.name}
						</div>
						<div className={styles.leaderboard_user_score}>
							{user.score}
						</div>
					</div>
				);
			})}
		</div>
	);
}

// Will take the best five users in the list.
function takeBestUsers(users: LocalUser[]) {
	return users.sort((a, b) => b.score - a.score).slice(0, 5);
}

// Will get users from the database.
function getUsers(): LocalUser[] {
	return (
		[
			{ id: "2", name: "Jane", score: 200 },
			{ id: "8", name: "Jum", score: 800 },
			{ id: "3", name: "Jack", score: 300 },
			{ id: "7", name: "Jem", score: 700 },
			{ id: "4", name: "Jill", score: 400 },
			{ id: "1", name: "John", score: 100 },
			{ id: "5", name: "Jim", score: 500 },
			{ id: "6", name: "Jm", score: 600 },
			{ id: "9", name: "Jemmmm", score: 9578 },
			{ id: "10", name: "Jemrom", score: 1000 },
		]
	)
}

// Will print the list of users in the leaderboard.
export default function Leaderboard() {

	const allUsers = getUsers();
	const bestUsers = takeBestUsers(allUsers);

  return (
		<>
			<div className={styles.leaderboard_background}>
				<div className={styles.leaderboard_title}>
					LEADERBOARD
				</div>
				{createLeaderboard(bestUsers)}
			</div>
		</>
  );
}
