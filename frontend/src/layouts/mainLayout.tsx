import React, { useRef } from "react";
import Router from "next/router";
import { DockGuest } from "../components/Dock/DockGuest";
import { useLoginContext } from "../context/LoginContext";
import styles from "../styles/Home.module.css";
import Link from "next/link";

// It would be way better to put that in a context, but I don't know how to do that.
let previousPage = false;

interface Props {
  children: React.ReactNode;
}

function OnUp(event: KeyboardEvent) {
  // const previousPage = useRef(false);

  if (event.key === "Escape") {
    const { pathname } = Router;
    if (pathname !== "/") {
      if (previousPage === false) {
        previousPage = true;
      }
      Router.push("/");
    } else if (previousPage === true) {
      window.history.back();
    }
  }
}

export const MainLayout: React.FunctionComponent<Props> = ({ children }) => {
  // This if statement is needed due to the server-side rendering of next.js
  if (typeof window !== "undefined") {
    document.addEventListener("keyup", OnUp);
  }

  const loginContext = useLoginContext();

  return (
    <>
      {loginContext.userLogin !== null ? (
        children
      ) : (
        <>
          <div className={styles.mainLayout_left_background} />
          <div className={styles.mainLayout_right_background} />
          <Link href="/game">
            <div className={styles.play}>PLAY</div>
          </Link>
          <DockGuest />
        </>
      )}
    </>
  );
};
