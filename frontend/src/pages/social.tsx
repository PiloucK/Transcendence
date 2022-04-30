import styles from "../styles/Home.module.css";
import { useLoginContext } from "../context/LoginContext";
import { DockGuest } from "../components/Dock/DockGuest";
import React, { useState } from "react";

import { IUserPublicInfos } from "../interfaces/users";
import userService from "../services/users";

import { SocialMenu } from "../components/Social/menu";
import {
  FriendContent,
  BlockedContent,
  NotificationContent,
} from "../components/Social/pagesContent";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

function SocialPage({ menu }: { menu: string }) {
  const loginContext = useLoginContext();
  const [friends, setFriends] = useState<IUserPublicInfos[]>([]);
  const [blocked, setBlocked] = useState<IUserPublicInfos[]>([]);
  const [notifications, setNotifications] = useState<IUserPublicInfos[]>([]);

  React.useEffect(() => {
    userService
      .getUserFriends(loginContext.userLogin)
      .then((friends: IUserPublicInfos[]) => {
        setFriends(friends);
      });

    userService
      .getUserBlockedUsers(loginContext.userLogin)
      .then((users: IUserPublicInfos[]) => {
        setBlocked(users);
      });

    userService
      .getUserFriendRequestsReceived(loginContext.userLogin)
      .then((notifications: IUserPublicInfos[]) => {
        setNotifications(notifications);
      });

    socket.on("update-leaderboard", () => {
      userService
        .getUserFriends(loginContext.userLogin)
        .then((friends: IUserPublicInfos[]) => {
          setFriends(friends);
        });

      userService
        .getUserBlockedUsers(loginContext.userLogin)
        .then((users: IUserPublicInfos[]) => {
          setBlocked(users);
        });

      userService
        .getUserFriendRequestsReceived(loginContext.userLogin)
        .then((notifications: IUserPublicInfos[]) => {
          setNotifications(notifications);
        });
    });

    socket.on("update-relations", () => {
      userService
        .getUserFriends(loginContext.userLogin)
        .then((friends: IUserPublicInfos[]) => {
          setFriends(friends);
        });

      userService
        .getUserBlockedUsers(loginContext.userLogin)
        .then((users: IUserPublicInfos[]) => {
          setBlocked(users);
        });

      userService
        .getUserFriendRequestsReceived(loginContext.userLogin)
        .then((notifications: IUserPublicInfos[]) => {
          setNotifications(notifications);
        });
    });
  }, []);

  if (menu === "all" || menu === "online" || menu === "offline") {
    return <FriendContent friends={friends} />;
  } else if (menu === "blocked") {
    return <BlockedContent users={blocked} />;
  } else if (menu === "notifications") {
    return <NotificationContent blockedUsers={blocked} notifications={notifications} />;
  }
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
        <SocialMenu menu={menu} setMenu={setMenu} />
        <SocialPage menu={menu} />
      </>
    );
  }
}
