import React from "react";
import styles from "../../styles/Home.module.css";
import BellIcon from "@mui/icons-material/Notifications";

import { NotificationChip } from "./NotificationChip";

function NotificationsButton() {
  return (
    <>
      <NotificationChip>
				<BellIcon />
			</NotificationChip>
    </>
  );
}

export function SocialMenu({
  menu,
  setMenu,
}: {
  menu: string;
  setMenu: (menu: string) => void;
}) {
  const getStyle = (key: string) => {
    if (menu === key) {
      return styles.social_menu_button_selected;
    } else {
      return styles.social_menu_button;
    }
  };

  return (
    <div className={styles.social_menu}>
      <div className={getStyle("all")} onClick={() => setMenu("all")}>
        All
      </div>
      <div className={getStyle("online")} onClick={() => setMenu("online")}>
        Online
      </div>
      <div className={getStyle("offline")} onClick={() => setMenu("offline")}>
        Offline
      </div>
      <div className={getStyle("blocked")} onClick={() => setMenu("blocked")}>
        Blocked users
      </div>
      <div
        className={getStyle("notifications")}
        onClick={() => setMenu("notifications")}
      >
        <NotificationsButton />
      </div>
    </div>
  );
}
