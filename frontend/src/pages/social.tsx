import styles from "../styles/Home.module.css";
import { useLoginContext } from "../context/LoginContext";
import { DockGuest } from "../components/Dock/DockGuest";
import React, { useState } from "react";

import { IUserPublicInfos } from "../interfaces/users";
import userService from "../services/user";

import { SocialMenu } from "../components/Social/menu";
import {
  FriendContent,
  BlockedContent,
  NotificationContent,
} from "../components/Social/pagesContent";

import io from "socket.io-client";

import { errorParser } from "../services/errorParser";

import getConfig from "next/config";
import { useErrorContext } from "../context/ErrorContext";
const { publicRuntimeConfig } = getConfig();
const socket = io(
  `http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.WEBSOCKETS_PORT}`,
  { transports: ["websocket"] }
);

function SocialPage({ menu }: { menu: string }) {
  const errorContext = useErrorContext();
  const loginContext = useLoginContext();
  const [friends, setFriends] = useState<IUserPublicInfos[]>([]);
  const [blocked, setBlocked] = useState<IUserPublicInfos[]>([]);
  const [notifications, setNotifications] = useState<IUserPublicInfos[]>([]);

  React.useEffect(() => {
    userService
      .getUserFriends(loginContext.userLogin)
      .then((friends: IUserPublicInfos[]) => {
        setFriends(friends);
      })
      .catch((error) => {
        errorContext.newError?.(errorParser(error, loginContext));
      });

    userService
      .getUserBlockedUsers(loginContext.userLogin)
      .then((users: IUserPublicInfos[]) => {
        setBlocked(users);
      })
      .catch((error) => {
        errorContext.newError?.(errorParser(error, loginContext));
      });

    userService
      .getUserFriendRequestsReceived(loginContext.userLogin)
      .then((notifications: IUserPublicInfos[]) => {
        setNotifications(notifications);
      })
      .catch((error) => {
        errorContext.newError?.(errorParser(error, loginContext));
      });

    socket.on("update-leaderboard", () => {
      userService
        .getUserFriends(loginContext.userLogin)
        .then((friends: IUserPublicInfos[]) => {
          setFriends(friends);
        })
        .catch((error) => {
          errorContext.newError?.(errorParser(error, loginContext));
        });

      userService
        .getUserBlockedUsers(loginContext.userLogin)
        .then((users: IUserPublicInfos[]) => {
          setBlocked(users);
        })
        .catch((error) => {
          errorContext.newError?.(errorParser(error, loginContext));
        });

      userService
        .getUserFriendRequestsReceived(loginContext.userLogin)
        .then((notifications: IUserPublicInfos[]) => {
          setNotifications(notifications);
        })
        .catch((error) => {
          errorContext.newError?.(errorParser(error, loginContext));
        });
    });

    socket.on("update-relations", () => {
      userService
        .getUserFriends(loginContext.userLogin)
        .then((friends: IUserPublicInfos[]) => {
          setFriends(friends);
        })
        .catch((error) => {
          errorContext.newError?.(errorParser(error, loginContext));
        });

      userService
        .getUserBlockedUsers(loginContext.userLogin)
        .then((users: IUserPublicInfos[]) => {
          setBlocked(users);
        })
        .catch((error) => {
          errorContext.newError?.(errorParser(error, loginContext));
        });

      userService
        .getUserFriendRequestsReceived(loginContext.userLogin)
        .then((notifications: IUserPublicInfos[]) => {
          setNotifications(notifications);
        })
        .catch((error) => {
          errorContext.newError?.(errorParser(error, loginContext));
        });
    });
  }, []);

  if (menu === "all" || menu === "online" || menu === "offline") {
    return <FriendContent friends={friends} />;
  } else if (menu === "blocked") {
    return <BlockedContent users={blocked} />;
  } else if (menu === "notifications") {
    return (
      <NotificationContent
        blockedUsers={blocked}
        notifications={notifications}
      />
    );
  }
}

export default function Social() {
  const [menu, setMenu] = useState("all");
  const errorContext = useErrorContext();
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
