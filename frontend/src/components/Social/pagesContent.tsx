import styles from "../../styles/Home.module.css";
import { IUserSlim } from "../../interfaces/IUser";
import {
  EmptyFriendList,
  EmptyBlockedList,
  EmptyNotificationcenter,
} from "./emptyPages";
import { CardUserSocial } from "../Cards/CardUserSocial";
import { CardFriendRequest } from "../Cards/CardFriendRequest";
import { CardBlockedUser } from "../Cards/CardBlockedUser";

function FriendList({ friends }: { friends: IUserSlim[] }) {
  return (
    <div className={styles.social_content}>
      {friends.map((friend) => CardUserSocial({ userInfos: friend }))}
    </div>
  );
}

function BlockedList({ users }: { users: IUserSlim[] }) {
  return (
    <div className={styles.social_content}>
      {users.map((user) => CardBlockedUser({ userInfos: user }))}
    </div>
  );
}

function NotificationList({ requests }: { requests: IUserSlim[] }) {
  return (
    <div className={styles.social_content}>
      {requests.map((request) => CardFriendRequest({ userInfos: request }))}
    </div>
  );
}

export function FriendContent({ friends }: { friends: IUserSlim[] }) {
  if (typeof friends === "undefined" || friends.length === 0) {
    return <EmptyFriendList />;
  } else {
    return <FriendList friends={friends} />;
  }
}

export function BlockedContent({ users }: { users: IUserSlim[] }) {
  if (typeof users === "undefined" || users.length === 0) {
    return <EmptyBlockedList />;
  } else {
    return <BlockedList users={users} />;
  }
}

export function NotificationContent({
  blockedUsers,
  notifications,
}: {
  blockedUsers: IUserSlim[];
  notifications: IUserSlim[];
}) {
  const requests = notifications?.filter(
    (notification) =>
      !blockedUsers?.some(
        (blockedUser) => blockedUser.login42 === notification.login42
      )
  );

  if (typeof requests === "undefined" || requests.length === 0) {
    return <EmptyNotificationcenter />;
  } else {
    return <NotificationList requests={requests} />;
  }
}
