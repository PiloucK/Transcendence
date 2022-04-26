import React from "react";
import styles from "../../styles/Home.module.css";

import Image from "next/image";
import Ghost from "../../public/ghost.png";
import Blocked from "../../public/blocked.png";
import upToDate from "../../public/upToDate.png";

export function EmptyFriendList() {
  return (
    <div className={styles.social_empty_page}>
      <Image src={Ghost} />
      Looks like you don’t have friends yet...
    </div>
  );
}

export function EmptyBlockedList() {
  return (
    <div className={styles.social_empty_page}>
      <Image src={Blocked} />
      Secret easter egg if you block at least 10 friends...
    </div>
  );
}

export function EmptyNotificationcenter() {
  return (
    <div className={styles.social_empty_page}>
      <Image src={upToDate} />
      You're up to date for now !
    </div>
  );
}