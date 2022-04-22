import React from "react";

import styles from "../styles/Home.module.css";
import { useLoginContext } from "../context/LoginContext";

export function ButtonLogout() {
	const loginContext = useLoginContext();

	const handleOnClick = () => {
		loginContext.logout?.();
	};

	if (loginContext.userName === null) return null;
  return (
    <button className={styles.logout_button} onClick={handleOnClick}>
      Logout
    </button>
  );
}
