import { ReactElement } from "react";
import MainLayout from "../layouts/mainLayout";
import styles from '../styles/Home.module.css'

export default function MainMenu() {
  return (
	<>
		<div className={styles.title}>LEADERBOARD</div>
	</>
  );
}

MainMenu.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
