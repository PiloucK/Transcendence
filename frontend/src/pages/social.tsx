import styles from "../styles/Home.module.css";
import { useSessionContext } from "../context/SessionContext";
import { ReactElement, useEffect, useState } from "react";

import { SocialMenu } from "../components/Social/menu";
import {
  FriendContent,
  BlockedContent,
  NotificationContent,
} from "../components/Social/pagesContent";

import { useSocketContext } from "../context/SocketContext";
import { DefaultLayout } from "../layouts/defaultLayout";
import { UserStatusLayout } from "../layouts/userStatusLayout";
import { useUserStatusContext } from "../context/UserStatusContext";

function SocialPage({ menu }: { menu: string }) {
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const userStatusContext = useUserStatusContext();

  useEffect(() => {
    socketContext.socket.on("update-leaderboard", () => {
      sessionContext.updateUserSelf?.();
    });

    socketContext.socket.on("update-relations", () => {
      sessionContext.updateUserSelf?.();
    });
  }, []);

  if (menu === "all") {
    return <FriendContent friends={sessionContext.userSelf.friends} />;
  } else if (menu === "online") {
    return (
      <FriendContent
        friends={sessionContext.userSelf.friends.filter((friend) => {
          const status = userStatusContext.statuses.get(friend.login42);
          if (status && status.status === "ONLINE") {
            return true;
          }
          return false;
        })}
      />
    );
  } else if (menu === "offline") {
    return (
      <FriendContent
        friends={sessionContext.userSelf.friends.filter((friend) => {
          const status = userStatusContext.statuses.get(friend.login42);
          if (!status || status.status === "OFFLINE") {
            return true;
          }
          return false;
        })}
      />
    );
  } else if (menu === "blocked") {
    return <BlockedContent users={sessionContext.userSelf.blockedUsers} />;
  } else if (menu === "notifications") {
    return (
      <NotificationContent
        blockedUsers={sessionContext.userSelf.blockedUsers}
        notifications={sessionContext.userSelf.friendRequestsReceived}
      />
    );
  } else {
    return <></>;
  }
}

export default function Social() {
  const [menu, setMenu] = useState("all");

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
Social.getLayout = function getLayout(page: ReactElement) {
  return (
    <DefaultLayout>
      <UserStatusLayout>{page}</UserStatusLayout>
    </DefaultLayout>
  );
};
