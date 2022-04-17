import Link from "next/link";
// import * as React from 'react';
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatIcon from "@mui/icons-material/Chat";
import GroupIcon from "@mui/icons-material/Group";
import LeaderboardIcon from "@mui/icons-material/EmojiEvents";
import GamemodeIcon from "@mui/icons-material/SportsEsports";

import { Dock } from "./Dock";
import styles from "../../styles/Home.module.css";

export function DockUser() {
  return (
    <Dock>
      <Link href="/profile">
        <IconButton className={styles.icons} aria-label="profile">
          <AccountCircleIcon />
        </IconButton>
      </Link>

      <Link href="/chat">
        <IconButton className={styles.icons} aria-label="chat">
          <ChatIcon />
        </IconButton>
      </Link>

      <Link href="/social">
        <IconButton className={styles.icons} aria-label="social">
          <GroupIcon />
        </IconButton>
      </Link>

      <Link href="/leaderboard">
        <IconButton className={styles.icons} aria-label="leaderboard">
          <LeaderboardIcon />
        </IconButton>
      </Link>

      <Link href="/gamemode">
        <IconButton className={styles.icons} aria-label="gamemode">
          <GamemodeIcon />
        </IconButton>
      </Link>
    </Dock>
  );
}
