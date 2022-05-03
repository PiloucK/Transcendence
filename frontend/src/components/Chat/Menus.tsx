import React, { useState } from "react";
import styles from "../../styles/Home.module.css";

import Image from "next/image";
import newMessageLogo from "../../public/new_message_logo.png";
import channelImage from "../../public/channel_image.png";
import directMessage from "../../public/direct_message.png";
import addChannel from "../../public/add_channel.png";

import { useLoginContext } from "../../context/LoginContext";
import { IUserPublicInfos, DM, Channel } from "../../interfaces/users";
import userService from "../../services/users";

import { ButtonTxtViewProfile } from "../Buttons/ButtonTxtViewProfile";
import { ButtonTxtBlockUser } from "../Buttons/ButtonTxtBlockUser";
import { ButtonTxtUserStatus } from "../Buttons/ButtonTxtUserStatus";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

function SelectedDMMenu({
  keyV,
  userLogin,
}: {
  keyV: string;
  userLogin: string;
}) {
  return (
    <div key={keyV} className={styles.chat_direct_message_menu_dm_selected}>
      {userLogin}
      <ButtonTxtViewProfile login={userLogin} />
      <ButtonTxtUserStatus login={userLogin} />
      <ButtonTxtBlockUser login={userLogin} />
    </div>
  );
}

function DMList({
  openedDMs,
  menu,
  setMenu,
}: {
  openedDMs: DM[];
  menu: string;
  setMenu: (menu: string) => void;
}) {
  const loginContext = useLoginContext();

  return openedDMs?.map((dm) => {
    const key = dm.userOne.login42 + "|" + dm.userTwo.login42;
    const username =
      dm.userOne.login42 === loginContext.userLogin
        ? dm.userTwo.username
        : dm.userOne.username;

    if (key === menu) {
      return (
        <SelectedDMMenu
          key={"selectedDMMenu"}
          keyV={key}
          userLogin={username}
        />
      );
    }
    return (
      <div
        key={key}
        className={styles.chat_direct_message_menu_new_selected}
        onClick={() => {
          setMenu(key);
        }}
      >
        {username}
      </div>
    );
  });
}

export function DirectMessageMenu(props: {
  menu: string;
  setMenu: (menu: string) => void;
}) {
  const loginContext = useLoginContext();
  const [openedDMs, setOpenedDMs] = React.useState<DM[]>([]);

  React.useEffect(() => {
    userService
      .getAllOpenedDM(loginContext.userLogin)
      .then((currentDMs: DM[]) => {
        setOpenedDMs(currentDMs);
      });

    socket.on("update-direct-messages", () => {
      userService
        .getAllOpenedDM(loginContext.userLogin)
        .then((currentDMs: DM[]) => {
          setOpenedDMs(currentDMs);
        });
    });
  }, []);

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
      <DMList openedDMs={openedDMs} menu={props.menu} setMenu={props.setMenu} />
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

function ChannelList({
  getStyle,
  setMenu,
  channels,
}: {
  getStyle: (key: string) => string;
  setMenu: (menu: string) => void;
  channels: Channel[];
}) {
  if (channels.length === 0) return null;
  return channels?.map((channel) => {
    return (
      <div
				key={channel.id}
        className={getStyle(channel.id)}
        onClick={() => {
          setMenu(channel.id);
        }}
      >
        <Image src={channelImage} alt="channel img" width={45} height={45} />
      </div>
    );
  });
}

export function ChatMenu(props: {
  menu: string;
  setMenu: (menu: string) => void;
}) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const loginContext = useLoginContext();

  React.useEffect(() => {
    userService
      .getJoinedChannels(loginContext.userLogin)
      .then((currentChannels: Channel[]) => {
        setChannels(currentChannels);
      });

    socket.on("update-channels", () => {
      userService
        .getJoinedChannels(loginContext.userLogin)
        .then((currentChannels: Channel[]) => {
          setChannels(currentChannels);
        });
    });
  }, []);

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
          width={55}
          height={55}
        />
      </div>
      <ChannelList
        getStyle={getStyle}
        setMenu={props.setMenu}
        channels={channels}
      />
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
