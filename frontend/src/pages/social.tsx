import Link from "next/link";
import styles from "../styles/Home.module.css";
import { useLoginContext } from "../context/LoginContext";
import { DockGuest } from "../components/Dock/DockGuest";
import React from "react";

import NotificationsIcon from "@mui/icons-material/Notifications";

import {
  EmptyFriendList,
  EmptyBlockedList,
  EmptyNotificationcenter,
} from "../components/Social/emptyPages";

function SocialMenuButtons({ setMenu }: { setMenu: (menu: string) => void }) {
  const [buttonClass, setButtonClass] = React.useState([
    styles.social_menu_button_selected,
    styles.social_menu_button,
    styles.social_menu_button,
    styles.social_menu_button,
    styles.social_menu_button,
  ]);

  const selectButton = (index: number) => {
    let buttonClass = [
      styles.social_menu_button,
      styles.social_menu_button,
      styles.social_menu_button,
      styles.social_menu_button,
      styles.social_menu_button,
    ];
    buttonClass[index] = styles.social_menu_button_selected;
    return buttonClass;
  };

  const setCurrentMenu = (index: number) => {
    setButtonClass(selectButton(index));
    const menu = ["all", "online", "offline", "blocked", "notifications"];
    setMenu(menu[index]);
  };

  return (
    <>
      <div className={buttonClass[0]} onClick={() => setCurrentMenu(0)}>
        All
      </div>
      <div className={buttonClass[1]} onClick={() => setCurrentMenu(1)}>
        Online
      </div>
      <div className={buttonClass[2]} onClick={() => setCurrentMenu(2)}>
        Offline
      </div>
      <div className={buttonClass[3]} onClick={() => setCurrentMenu(3)}>
        Blocked users
      </div>
      <div className={buttonClass[4]} onClick={() => setCurrentMenu(4)}>
        <NotificationsIcon />
      </div>
    </>
  );
}

function SocialPage({ menu }: { menu: string }) {
  if (menu === "all" || menu === "online" || menu === "offline") {
    return <EmptyFriendList />;
  } else if (menu === "blocked") {
    return <EmptyBlockedList />;
  } else if (menu === "notifications") {
    return <EmptyNotificationcenter />;
  }
}

function SocialMenu({ setMenu }: { setMenu: (menu: string) => void }) {
  return (
    <div className={styles.social_menu}>
      <SocialMenuButtons setMenu={setMenu} />
    </div>
  );
}

export default function Social() {
  const [menu, setMenu] = React.useState("all");

  if (typeof window !== "undefined") {
    document.body.style.backgroundColor = "#00213D";
  }

  return (
    <>
      <div className={styles.social_title}>Friends</div>
      <SocialMenu setMenu={setMenu} />
      <SocialPage menu={menu} />
    </>
  );
}
