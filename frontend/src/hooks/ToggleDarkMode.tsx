import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import React from "react";
import styles from "../styles/Home.module.css";

export const ToggleDarkMode = () => {
  const { dark, toggleDark } = useContext(ThemeContext);

  const handleOnClick = () => {
    toggleDark?.();
    // console.log(dark);
  };

  return (
    <>
      {/* <div className={styles.grid}> */}
      {/* <Link href='/'> */}
      <a className={styles.card} onClick={handleOnClick}>
        <h2>{dark ? "Dark" : "Light"} </h2>
        {/* <p>Find in-depth information about Next.js features and API.</p> */}
      </a>
      {/* </Link> */}
      {/* </div> */}
    </>
  );
};
