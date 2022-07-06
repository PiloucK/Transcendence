import Link from "next/link";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatIcon from "@mui/icons-material/Chat";
import GroupIcon from "@mui/icons-material/Group";
import LeaderboardIcon from "@mui/icons-material/EmojiEvents";
import GamemodeIcon from "@mui/icons-material/SportsEsports";
import CheckIcon from "@mui/icons-material/Check";
import { Dock } from "./Dock";
import styles from "../../styles/Home.module.css";
import { Tooltip } from "@mui/material";
import { SetProfileFirstLogin } from "../Alerts/SetProfileFirstLogin";

function NavigationDock({
  setIsInNavigation,
}: {
  setIsInNavigation: (mode: boolean) => void;
}) {
  return (
    <>
      <Dock>
        <Link href="/profile">
          <Tooltip title="Profile">
            <IconButton className={styles.icons} aria-label="profile">
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>
        </Link>

        <Link href="/chat">
          <Tooltip title="Chat">
            <IconButton className={styles.icons} aria-label="chat">
              <ChatIcon />
            </IconButton>
          </Tooltip>
        </Link>

        <Link href="/social">
          <Tooltip title="Friends">
            <IconButton className={styles.icons} aria-label="social">
              <GroupIcon />
            </IconButton>
          </Tooltip>
        </Link>

        <Link href="/leaderboard">
          <Tooltip title="Leaderboard">
            <IconButton className={styles.icons} aria-label="leaderboard">
              <LeaderboardIcon />
            </IconButton>
          </Tooltip>
        </Link>

        <Tooltip title="Game mode">
          <IconButton
            onClick={() => setIsInNavigation(false)}
            className={styles.icons}
            aria-label="gamemode"
          >
            <GamemodeIcon />
          </IconButton>
        </Tooltip>
      </Dock>

      <SetProfileFirstLogin />
    </>
  );
}

function GamemodeDock({
  setIsInNavigation,
}: {
  setIsInNavigation: (mode: boolean) => void;
}) {
  return (
    <Dock>
      <IconButton
        onClick={() => setIsInNavigation(true)}
        className={styles.icons}
        aria-label="gamemode"
      >
        <CheckIcon />
      </IconButton>
    </Dock>
  );
}

export function DockUser() {
  const [isInNavigation, setIsInNavigation] = useState(true);

  if (isInNavigation) {
    return <NavigationDock setIsInNavigation={setIsInNavigation} />;
  } else {
    return <GamemodeDock setIsInNavigation={setIsInNavigation} />;
  }
}
