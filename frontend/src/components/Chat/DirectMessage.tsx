import React from "react";
import styles from "../../styles/Home.module.css";
import { EmptyFriendList } from "../Social/emptyPages";

import { DirectMessageMenu } from "./Menus";

function NewDirectMessage() {
  return (
    <div className={styles.chat_direct_message_content}>
      Select a friend to start a conversation
      <EmptyFriendList />
    </div>
  );
}

function DirectMessageContent({ menu }: { menu: string }) {
  if (menu === "new_message") {
    return <NewDirectMessage />;
  } else {
    return (
      <div className={styles.chat_direct_message_content}>DM with friend</div>
    );
  }
}

export function DirectMessage() {
  const [menu, setMenu] = React.useState("new_message");

  return (
    <>
      <DirectMessageMenu menu={menu} setMenu={setMenu} />
      <DirectMessageContent menu={menu} />
    </>
  );
}
