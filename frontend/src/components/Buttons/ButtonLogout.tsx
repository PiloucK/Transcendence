import React from "react";

import styles from "../../styles/Home.module.css";
import { useSessionContext } from "../../context/SessionContext";

export function ButtonLogout() {
  const sessionContext = useSessionContext();

  const handleOnClick = () => {
    sessionContext.logout?.();
  };

  if (sessionContext.userLogin === null) return null;
  return (
    <button className={styles.logout_button} onClick={handleOnClick}>
      Logout
    </button>
  );
}
