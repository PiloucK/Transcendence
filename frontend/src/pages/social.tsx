import Link from "next/link";
import styles from "../styles/Home.module.css";
import { useLoginContext } from "../context/LoginContext";
import { DockGuest } from "../components/Dock/DockGuest";
import React, { useState } from "react";

import NotificationsIcon from "@mui/icons-material/Notifications";

import {
  EmptyFriendList,
  EmptyBlockedList,
  EmptyNotificationcenter,
} from "../components/Social/emptyPages";

import { IUserPublicInfos } from "../interfaces/users";
import userService from "../services/users";

import { CardUserSocial } from "../components/Cards/CardUserSocial";
import { CardFriendRequest } from "../components/Cards/CardFriendRequest";
import { CardBlockedUser } from "../components/Cards/CardBlockedUser";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

function SocialMenuButtons({ setMenu }: { setMenu: (menu: string) => void }) {
  const [buttonClass, setButtonClass] = useState([
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

function FriendList({ friends }: { friends: IUserPublicInfos[] }) {
  return (
    <div className={styles.social_content}>
      {friends.map((friend) => CardUserSocial({ userInfos: friend }))}
    </div>
  );
}

function BlockedList({ users }: { users: IUserPublicInfos[] }) {
  return (
    <div className={styles.social_content}>
      {users.map((user) => CardBlockedUser({ userInfos: user }))}
    </div>
  );
}

function NotificationList({ requests }: { requests: IUserPublicInfos[] }) {
  return (
    <div className={styles.social_content}>
      {requests.map((request) => CardFriendRequest({ userInfos: request }))}
    </div>
  );
}

function SocialPage({ menu }: { menu: string }) {
  const loginContext = useLoginContext();
  const [friends, setFriends] = useState<IUserPublicInfos[]>([]);
  const [blocked, setBlocked] = useState<IUserPublicInfos[]>([]);
  const [notifications, setNotifications] = useState<IUserPublicInfos[]>([]);

  React.useEffect(() => {
    userService.getUserFriends(loginContext.userLogin).then((friends: IUserPublicInfos[]) => {
      setFriends(friends);
    });

    socket.on("update-leaderboard", () => {
      userService.getUserFriends(loginContext.userLogin).then((friends: IUserPublicInfos[]) => {
        setFriends(friends);
      });
    });
  }, []);

  if (menu === "all" || menu === "online" || menu === "offline") {
    if (typeof friends === "undefined" || friends.length === 0) {
      return <EmptyFriendList />;
    } else {
      return <FriendList friends={friends} />;
    }
  } else if (menu === "blocked") {
    if (typeof friends === "undefined" || friends.length === 0) {
      return <EmptyBlockedList />;
    } else {
      return <BlockedList users={friends} />;
    }
  } else if (menu === "notifications") {
    if (typeof friends === "undefined" || friends.length === 0) {
      return <EmptyNotificationcenter />;
    } else {
      return <NotificationList requests={friends} />;
    }
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
  const [menu, setMenu] = useState("all");
  const loginContext = useLoginContext();

  if (typeof window !== "undefined") {
    document.body.style.backgroundColor = "#00213D";
  }

  if (loginContext.userLogin === null) {
    return <DockGuest />;
  } else {
    return (
      <>
        <div className={styles.social_title}>Friends</div>
        <SocialMenu setMenu={setMenu} />
        <SocialPage menu={menu} />
      </>
    );
  }
}
