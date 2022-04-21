import { useThemeContext } from "../context/ThemeContext";
import React from "react";
import styles from "../styles/Home.module.css";

export const ToggleDarkMode = () => {
  const themeContext = useThemeContext();

  const handleOnClick = () => {
    themeContext.toggleDark?.();
  };

  return (
    <>
      <a className={styles.card} onClick={handleOnClick}>
        <h2>{themeContext.dark ? "Dark" : "Light"} </h2>
      </a>
    </>
  );
};
