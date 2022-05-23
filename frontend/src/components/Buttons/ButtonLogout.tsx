import React from "react";

import styles from "../../styles/Home.module.css";
import { useLoginContext } from "../../context/LoginContext";

import Cookies from "js-cookie";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export function ButtonLogout() {
  const loginContext = useLoginContext();

  const handleOnClick = () => {
    loginContext.logout?.();
    Cookies.remove(publicRuntimeConfig.ACCESSTOKEN_COOKIE_NAME, {
      path: publicRuntimeConfig.ACCESSTOKEN_COOKIE_PATH,
    });
  };

  if (loginContext.userLogin === null) return null;
  return (
    <button className={styles.logout_button} onClick={handleOnClick}>
      Logout
    </button>
  );
}
