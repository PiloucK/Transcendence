import React, { useState } from "react";
import styles from "../../styles/Home.module.css";

import Image from "next/image";
import newMessageLogo from "../../public/new_message_logo.png";
import channelImage from "../../public/channel_image.png";
import directMessage from "../../public/direct_message.png";
import addChannel from "../../public/add_channel.png";

import { useSessionContext } from "../../context/SessionContext";
import { PrivateConv, Channel } from "../../interfaces/Chat.interfaces";
import channelService from "../../services/channel";
import privateConvService from "../../services/privateConv";

import { ButtonTxtViewProfile } from "../Buttons/ButtonTxtViewProfile";
import { ButtonTxtBlockUser } from "../Buttons/ButtonTxtBlockUser";
import { ButtonTxtUserStatus } from "../Buttons/ButtonTxtUserStatus";
import { ButtonTxtMuteUser } from "../Buttons/ButtonTxtMuteUser";
import { ButtonTxtBanUser } from "../Buttons/ButtonTxtBanUser";
import { ButtonTxtSetAsAdmin } from "../Buttons/ButtonTxtSetAsAdmin";

import ChannelSettings from "../Buttons/ChannelSettings";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useSocketContext } from "../../context/SocketContext";

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
  openedDMs: PrivateConv[];
  menu: string;
  setMenu: (menu: string) => void;
}) {
  const sessionContext = useSessionContext();

  return openedDMs?.map((dm) => {
    const key = dm.userOne.login42 + "|" + dm.userTwo.login42;
    const username =
      dm.userOne.login42 === sessionContext.userLogin
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
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const [openedDMs, setOpenedDMs] = React.useState<PrivateConv[]>([]);

  React.useEffect(() => {
    privateConvService
      .getPrivateConvs(sessionContext.userLogin)
      .then((currentDMs: PrivateConv[]) => {
        setOpenedDMs(currentDMs);
      });

    socketContext.socket.on("update-direct-messages", () => {
      privateConvService
        .getPrivateConvs(sessionContext.userLogin)
        .then((currentDMs: PrivateConv[]) => {
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

function SelectedUserMenu({
  userLogin,
  getUserStyle,
  setSelectedUser,
  channel,
}: {
  userLogin: string;
  getUserStyle: (userLogin: string) => any;
  setSelectedUser: (userLogin: string) => void;
  channel: Channel;
}) {
  const sessionContext = useSessionContext();

  if (sessionContext.userLogin === channel?.owner) {
    return (
      <div className={styles.selected_user}>
        <div
          className={getUserStyle(userLogin)}
          onClick={() => setSelectedUser("")}
        >
          {userLogin}
        </div>
        <ButtonTxtViewProfile login={userLogin} />
        <ButtonTxtUserStatus login={userLogin} />
        <ButtonTxtBlockUser login={userLogin} />
        <ButtonTxtMuteUser login={userLogin} channel={channel} />
        <ButtonTxtBanUser login={userLogin} channel={channel} />
        <ButtonTxtSetAsAdmin login={userLogin} channel={channel} />
      </div>
    );
  } else if (channel?.admins?.includes(sessionContext.userLogin)) {
    return (
      <div className={styles.selected_user}>
        <div
          className={getUserStyle(userLogin)}
          onClick={() => setSelectedUser("")}
        >
          {userLogin}
        </div>
        <ButtonTxtViewProfile login={userLogin} />
        <ButtonTxtUserStatus login={userLogin} />
        <ButtonTxtBlockUser login={userLogin} />
        <ButtonTxtMuteUser login={userLogin} channel={channel} />
        <ButtonTxtBanUser login={userLogin} channel={channel} />
      </div>
    );
  } else {
    return (
      <div className={styles.selected_user}>
        <div
          className={getUserStyle(userLogin)}
          onClick={() => setSelectedUser("")}
        >
          {userLogin}
        </div>
        <ButtonTxtViewProfile login={userLogin} />
        <ButtonTxtUserStatus login={userLogin} />
        <ButtonTxtBlockUser login={userLogin} />
      </div>
    );
  }
}

function UserList({ channel }: { channel: Channel }) {
  const sessionContext = useSessionContext();
  const [selectedUser, setSelectedUser] = useState<String>("");

  const getUserStyle = (userLogin: string) => {
    if (userLogin === channel?.owner) {
      return styles.owner;
    } else if (channel?.admins?.includes(userLogin)) {
      return styles.admins;
    } else {
      return styles.users;
    }
  };

  return channel?.users?.map((user) => {
    if (user.login42 === sessionContext.userLogin) {
      return (
        <div key={user.login42} className={styles.connected_user}>
          {user.username}
        </div>
      );
    } else if (user.login42 === selectedUser) {
      return (
        <SelectedUserMenu
          key={user.login42}
          userLogin={selectedUser}
          getUserStyle={getUserStyle}
          setSelectedUser={setSelectedUser}
          channel={channel}
        />
      );
    } else {
      return (
        <div
          key={user.login42}
          className={getUserStyle(user.login42)}
          onClick={() => {
            setSelectedUser(user.login42);
          }}
        >
          {user.username}
        </div>
      );
    }
  });
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export function ChannelMenu({ channel }: { channel: Channel }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={styles.channel_menu}>
      <div className={styles.title} onClick={() => {}}>
        {channel?.name}
        <ChannelSettings channel={channel} />
      </div>
      <div className={styles.tabs}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="users tab">
            <Tab label="Online" {...a11yProps(0)} />
            <Tab label="Offline" {...a11yProps(1)} />
          </Tabs>
        </Box>
      </div>
      <TabPanel value={value} index={0}>
        <UserList channel={channel} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <UserList channel={channel} />
      </TabPanel>
    </div>
  );
}

export function AddChannelMenu(props: {
  menu: string;
  setMenu: ((menu: string) => void) | undefined;
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
          props.setMenu?.("public_channels");
        }}
      >
        Public Channels
      </div>
      <div
        className={getStyle("create_channel")}
        onClick={() => {
          props.setMenu?.("create_channel");
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
  setMenu: ((menu: string) => void) | undefined;
  channels: Channel[];
}) {
  if (channels.length === 0) return null;
  return channels?.map((channel) => {
    return (
      <div
        key={channel.id}
        className={getStyle(channel.id)}
        onClick={() => {
          setMenu?.(channel.id);
        }}
      >
        <Image src={channelImage} alt="channel img" width={45} height={45} />
      </div>
    );
  });
}

export function ChatMenu(props: {
  menu: string;
  setMenu: ((menu: string) => void) | undefined;
}) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();

  React.useEffect(() => {
    channelService
      .getJoinedChannels(sessionContext.userLogin)
      .then((currentChannels: Channel[]) => {
        setChannels(currentChannels);
      });
    socketContext.socket.on("update-channels-list", () => {
      channelService
        .getJoinedChannels(sessionContext.userLogin)
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
          props.setMenu?.("direct_message");
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
          props.setMenu?.("add_channel");
        }}
      >
        <Image src={addChannel} alt="add channel" width={45} height={45} />
      </div>
    </div>
  );
}
