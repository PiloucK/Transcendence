import React from "react";
import styles from "../../styles/Home.module.css";

import Image from "next/image";
import newMessageLogo from "../../public/new_message_logo.png";
import directMessage from "../../public/direct_message.png";
import addChannel from "../../public/add_channel.png";

export function DirectMessageMenu(props: {
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

export function AddChannelMenu(props: {
  menu: string;
  setMenu: (menu: string) => void;
}) {
  const getStyle = (key: string) => {
    if (props.menu === key) {
      return styles.chat_add_channel_menu_button_selected;
    } else {
      return styles.chat_add_channel_menu_button;
    }
  };

  return (
    <div className={styles.chat_add_channel_menu}>
      <div
        className={getStyle("public_channels")}
        onClick={() => {
          props.setMenu("public_channels");
        }}
      >
        Public Channels
      </div>
      <div
        className={getStyle("create_channel")}
        onClick={() => {
          props.setMenu("create_channel");
        }}
      >
        Create Channel
      </div>
    </div>
  );
}

export function ChatMenu(props: {
  menu: string;
  setMenu: (menu: string) => void;
}) {
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
