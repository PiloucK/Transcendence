import styles from "../styles/Home.module.css";
import { useSessionContext } from "../context/SessionContext";
// import { DockGuest } from "../components/Dock/DockGuest";
import React, { useState } from "react";

import { IUserPublic } from "../interfaces/IUser";
import userService from "../services/user";

import { SocialMenu } from "../components/Social/menu";
import {
  FriendContent,
  BlockedContent,
  NotificationContent,
} from "../components/Social/pagesContent";

import { errorHandler } from "../errors/errorHandler";

import { useErrorContext } from "../context/ErrorContext";
import { useSocketContext } from "../context/SocketContext";

function SocialPage({ menu }: { menu: string }) {
  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const [friends, setFriends] = useState<IUserPublic[]>([]);
  const [blocked, setBlocked] = useState<IUserPublic[]>([]);
  const [notifications, setNotifications] = useState<IUserPublic[]>([]);

  React.useEffect(() => {
    userService
      .getUserFriends(sessionContext.userLogin)
      .then((friends: IUserPublic[]) => {
        setFriends(friends);
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });

    userService
      .getUserBlockedUsers(sessionContext.userLogin)
      .then((users: IUserPublic[]) => {
        setBlocked(users);
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });

    userService
      .getUserFriendRequestsReceived(sessionContext.userLogin)
      .then((notifications: IUserPublic[]) => {
        setNotifications(notifications);
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });

    socketContext.socket.on("update-leaderboard", () => {
      userService
        .getUserFriends(sessionContext.userLogin)
        .then((friends: IUserPublic[]) => {
          setFriends(friends);
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
        });

      userService
        .getUserBlockedUsers(sessionContext.userLogin)
        .then((users: IUserPublic[]) => {
          setBlocked(users);
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
        });

      userService
        .getUserFriendRequestsReceived(sessionContext.userLogin)
        .then((notifications: IUserPublic[]) => {
          setNotifications(notifications);
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
        });
    });

    socketContext.socket.on("update-relations", () => {
      userService
        .getUserFriends(sessionContext.userLogin)
        .then((friends: IUserPublic[]) => {
          setFriends(friends);
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
        });

      userService
        .getUserBlockedUsers(sessionContext.userLogin)
        .then((users: IUserPublic[]) => {
          setBlocked(users);
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
        });

      userService
        .getUserFriendRequestsReceived(sessionContext.userLogin)
        .then((notifications: IUserPublic[]) => {
          setNotifications(notifications);
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
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
  const sessionContext = useSessionContext();

  if (typeof window !== "undefined") {
    document.body.style.backgroundColor = "#00213D";
  }

    return (
      <>
        <div className={styles.social_title}>Friends</div>
        <SocialMenu menu={menu} setMenu={setMenu} />
        <SocialPage menu={menu} />
      </>
    );
}
