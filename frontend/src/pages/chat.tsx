import React from "react";
import styles from "../styles/Home.module.css";

import Image from "next/image";
import directMessage from "../public/direct_message.png";
import addChannel from "../public/add_channel.png";
import newMessageLogo from "../public/new_message_logo.png";

function DirectMessageMenu(props: {
  menu: string;
  setMenu: (menu: string) => void;
}) {
  const getStyle = (key: string) => {
    if (props.menu === key) {
      return styles.chat_direct_message_menu_new_selected;
    } else {
      return styles.chat_direct_message_menu_new;
    }
  };
  return (
    <div className={styles.chat_direct_message_menu}>
      <div className={styles.chat_direct_message_menu_title}>
        Direct Messages
      </div>
      <div
        className={getStyle("new_message")}
        onClick={() => {
          props.setMenu("new_message");
        }}
      >
        <Image src={newMessageLogo} alt="new message" width={18} height={18} />
        New message
      </div>
      {/* Put the map of current DM here */}
    </div>
  );
}

function DirectMessageContent({ menu }: { menu: string }) {
  if (menu === "new_message") {
    return (
      <div className={styles.chat_direct_message_content}>
        Select a friend to start a conversation
      </div>
    );
  } else {
    return (
      <div className={styles.chat_direct_message_content}>DM with friend</div>
    );
  }
}

function DirectMessage() {
  const [menu, setMenu] = React.useState("new_message");

  return (
    <>
      <DirectMessageMenu menu={menu} setMenu={setMenu} />
      <DirectMessageContent menu={menu} />
    </>
  );
}

function ChatMenu(props: { menu: string; setMenu: (menu: string) => void }) {
  const getStyle = (key: string) => {
    if (props.menu === key) {
      return styles.chat_menu_button_selected;
    } else {
      return styles.chat_menu_button;
    }
  };
  return (
    <div className={styles.chat_menu}>
      <div
        className={getStyle("direct_message")}
        onClick={() => {
          props.setMenu("direct_message");
        }}
      >
        <Image
          src={directMessage}
          alt="direct message"
          width={45}
          height={45}
        />
      </div>
      {/* Here should be a map of element for each server */}
      <div
        className={getStyle("add_channel")}
        onClick={() => {
          props.setMenu("add_channel");
        }}
      >
        <Image src={addChannel} alt="add channel" width={45} height={45} />
      </div>
    </div>
  );
}

function ChatContent({ menu }: { menu: string }) {
  if (menu === "direct_message") {
    return <DirectMessage />;
  } else if (menu === "add_channel") {
    return <div>Add channel</div>;
  } else {
    return <div>Channel</div>;
  }
}

export default function Chat() {
  const [menu, setMenu] = React.useState("direct_message");

  return (
    <>
      <ChatMenu menu={menu} setMenu={setMenu} />
      <ChatContent menu={menu} />
    </>
  );
}
