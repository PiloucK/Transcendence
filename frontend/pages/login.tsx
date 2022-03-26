import type { ReactElement } from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { ToggleDarkMode } from "../hooks/ToggleDarkMode";
// import { Game } from "../components/Game";

export default function Login() {
  return (
    <div className={styles.grid}>
      <Link href='/'>
      {/* <Game /> */}
      <p>Find in-depth information about Next.js features and API.</p>
      </Link>
      <ToggleDarkMode/>
    </div>
  );
}

// Login.getLayout = function getLayout(chat: ReactElement) {
//   return <>{chat}</>;
// };
