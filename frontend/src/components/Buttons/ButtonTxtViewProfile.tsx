import React from "react";

import styles from "../../styles/Home.module.css";
import { IUserPublicInfos } from "../../interfaces/users";

import Router from "next/router";

export function ButtonTxtViewProfile({ login }: { login: string }) {
  const handleOnClick = () => {
    Router.push(`/profile?login=${login}`);
  };

  return (
    <div
      className={styles.buttons}
      onClick={handleOnClick}
    >
      View profile
    </div>
  );
}
