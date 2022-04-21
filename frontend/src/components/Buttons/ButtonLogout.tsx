import React from "react";

import styles from "../../styles/Home.module.css";
import { useLoginContext } from "../../context/LoginContext";

export function ButtonLogout() {
	const loginContext = useLoginContext();

  return (
    <button className={styles.logout_button} onClick={loginContext.logout}>
      Logout
    </button>
  );
}
