import Link from "next/link";
import React from "react";
import styles from "../styles/Home.module.css";

interface Props {
  children: React.ReactNode
}

const Dock: React.FunctionComponent<Props> = ({ children }) => {
  return <div className={styles.dock}>{children}</div>;
}

export default Dock;
