import Link from "next/link";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatIcon from "@mui/icons-material/Chat";
import GroupIcon from "@mui/icons-material/Group";
import LeaderboardIcon from "@mui/icons-material/EmojiEvents";
import Filter1Icon from "@mui/icons-material/Filter1";
import Filter2Icon from "@mui/icons-material/Filter2";
import Filter3Icon from "@mui/icons-material/Filter3";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
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

        <Tooltip title="Practice mode">
          <IconButton
            onClick={() => setIsInNavigation(false)}
            className={styles.icons}
            aria-label="practicemode"
          >
            <PrecisionManufacturingIcon />
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
      <Tooltip title="Go back">
        <IconButton
          onClick={() => setIsInNavigation(true)}
          className={styles.icons}
          aria-label="Go back"
        >
          <ArrowBackIosNewIcon />
        </IconButton>
      </Tooltip>

      <Link href="/training-mode?computerlvl=1">
        <Tooltip title="Difficulty: easy">
          <IconButton className={styles.icons} aria-label="Easy">
            <Filter1Icon />
          </IconButton>
        </Tooltip>
      </Link>

      <Link href="/training-mode?computerlvl=2">
        <Tooltip title="Difficulty: medium">
          <IconButton className={styles.icons} aria-label="Medium">
            <Filter2Icon />
          </IconButton>
        </Tooltip>
      </Link>

      <Link href="/training-mode?computerlvl=3">
        <Tooltip title="Difficulty: hard">
          <IconButton className={styles.icons} aria-label="Hard">
            <Filter3Icon />
          </IconButton>
        </Tooltip>
      </Link>
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
