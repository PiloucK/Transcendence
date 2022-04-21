import { ToggleDarkMode } from "../hooks/ToggleDarkMode";
import { ButtonLogout } from "../components/Buttons/ButtonLogout";
import styles from "../styles/Home.module.css";
import { useLoginContext } from "../context/LoginContext";

export default function Profile() {
	const loginContext = useLoginContext();
  
	return (
		<div className={styles.profile_user_stats}>
			<div className={styles.profile_user_username}>
				{loginContext.userName}
			</div>
			<ToggleDarkMode />
			<ButtonLogout />
		</div>
	);
}
