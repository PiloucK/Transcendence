import { ReactElement } from "react";
import Dock from "./Dock";
import styles from '../../styles/Home.module.css'

// import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatIcon from '@mui/icons-material/Chat';
import GroupIcon from '@mui/icons-material/Group';
import LeaderboardIcon from '@mui/icons-material/EmojiEvents';
import GamemodeIcon from '@mui/icons-material/SportsEsports';

export default function DockUser() {
	return (
	  <Dock>
		  <IconButton className={styles.icons} aria-label="account">
			  <AccountCircleIcon />
		  </IconButton>
		  <IconButton className={styles.icons} aria-label="chat">
			  <ChatIcon />
		  </IconButton>
		  <IconButton className={styles.icons} aria-label="social">
			  <GroupIcon />
		  </IconButton>
		  <IconButton className={styles.icons} aria-label="leaderboard">
			  <LeaderboardIcon />
		  </IconButton>
		  <IconButton className={styles.icons} aria-label="gamemode">
			  <GamemodeIcon />
		  </IconButton>
	  </Dock>
	);
  }