import { ReactElement } from "react";
import DockUser from "../components/Dock/DockUser";
import styles from "../styles/Home.module.css";
import DockGuest from "../components/Dock/DockGuest";
import MainLayout from "../layouts/mainLayout";
import {ToggleDarkMode} from "../hooks/ToggleDarkMode";

//Show a Big play button to start the game in the middle of the screen.
export default function MainMenu() {
  return (
    <>
      <div className={styles.mainLayout_left_background} />
      <div className={styles.mainLayout_right_background} />
      <div className={styles.play}>PLAY</div>
      <DockUser />
      <DockGuest />
      <ToggleDarkMode />
    </>
  );
}
