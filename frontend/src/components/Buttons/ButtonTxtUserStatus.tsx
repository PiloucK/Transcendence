import React from "react";

import styles from "../../styles/Home.module.css";
import { IUserPublicInfos } from "../../interfaces/IUser";

export function ButtonTxtUserStatus({ login }: { login: string }) {
  const handleOnClick = () => {
  };

  return (
    <div
      className={styles.buttons}
      onClick={handleOnClick}
    >
      Invite to play
    </div>
  );
}
