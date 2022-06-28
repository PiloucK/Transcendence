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

import Avatar from "@mui/material/Avatar";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useSocketContext } from "../../context/SocketContext";
import { IUserSelf, IUserSlim } from "../../interfaces/IUser";

function SelectedDMMenu({ keyV, user }: { keyV: string; user: IUserSelf }) {
  return (
    <div key={keyV} className={styles.chat_direct_message_menu_dm_selected}>
      <Avatar
        className={styles.chat_avatar}
        src={user.image}
        sx={{ width: "20px", height: "20px" }}
      >
        <Avatar
          className={styles.chat_avatar}
          src={user.photo42}
          sx={{ width: "20px", height: "20px" }}
        />
      </Avatar>
      {user.login42}
      <ButtonTxtViewProfile login={user.login42} />
      <ButtonTxtUserStatus login={user.login42} />
      <ButtonTxtBlockUser login={user.login42} />
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
    const user =
      dm.userOne.login42 === sessionContext.userSelf.login42 ? dm.userTwo : dm.userOne;

    if (key === menu) {
      return <SelectedDMMenu key={"selectedDMMenu"} keyV={key} user={user} />;
    }
    return (
      <div
        key={key}
        className={styles.chat_direct_message_menu_new_selected}
        onClick={() => {
          setMenu(key);
        }}
      >
        <Avatar
          className={styles.chat_avatar}
          src={user.image}
          sx={{ width: "20px", height: "20px" }}
        >
          <Avatar
            className={styles.chat_avatar}
            src={user.photo42}
            sx={{ width: "20px", height: "20px" }}
          />
        </Avatar>
        {user.login42}
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
      .getPrivateConvs(sessionContext.userSelf.login42)
      .then((currentDMs: PrivateConv[]) => {
        setOpenedDMs(currentDMs);
      });

    socketContext.socket.on("update-direct-messages", () => {
      privateConvService
        .getPrivateConvs(sessionContext.userSelf.login42)
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
  user,
  getUserStyle,
  setSelectedUser,
  channel,
}: {
  user: IUserSlim;
  getUserStyle: (userLogin: string) => any;
  setSelectedUser: (userLogin: string) => void;
  channel: Channel;
}) {
  const sessionContext = useSessionContext();

  if (sessionContext.userSelf.login42 === channel?.owner) {
    return (
      <div className={styles.selected_user}>
        <div
          className={getUserStyle(user.login42)}
          onClick={() => setSelectedUser("")}
        >
          <Avatar
            className={styles.chat_avatar}
            src={user.image}
            sx={{ width: "20px", height: "20px" }}
          >
            <Avatar
              className={styles.chat_avatar}
              src={user.photo42}
              sx={{ width: "20px", height: "20px" }}
            />
          </Avatar>
          {user.login42}
        </div>
        <ButtonTxtViewProfile login={user.login42} />
        <ButtonTxtUserStatus login={user.login42} />
        <ButtonTxtBlockUser login={user.login42} />
        <ButtonTxtMuteUser login={user.login42} channel={channel} />
        <ButtonTxtBanUser login={user.login42} channel={channel} />
        <ButtonTxtSetAsAdmin login={user.login42} channel={channel} />
      </div>
    );
  } else if (channel?.admin?.includes(sessionContext.userSelf.login42)) {
    return (
      <div className={styles.selected_user}>
        <div
          className={getUserStyle(user.login42)}
          onClick={() => setSelectedUser("")}
        >
          <Avatar
            className={styles.chat_avatar}
            src={user.image}
            sx={{ width: "20px", height: "20px" }}
          >
            <Avatar
              className={styles.chat_avatar}
              src={user.photo42}
              sx={{ width: "20px", height: "20px" }}
            />
          </Avatar>
          {user.login42}
        </div>
        <ButtonTxtViewProfile login={user.login42} />
        <ButtonTxtUserStatus login={user.login42} />
        <ButtonTxtBlockUser login={user.login42} />
        <ButtonTxtMuteUser login={user.login42} channel={channel} />
        <ButtonTxtBanUser login={user.login42} channel={channel} />
      </div>
    );
  } else {
    return (
      <div className={styles.selected_user}>
        <div
          className={getUserStyle(user.login42)}
          onClick={() => setSelectedUser("")}
        >
          <Avatar
            className={styles.chat_avatar}
            src={user.image}
            sx={{ width: "20px", height: "20px" }}
          >
            <Avatar
              className={styles.chat_avatar}
              src={user.photo42}
              sx={{ width: "20px", height: "20px" }}
            />
          </Avatar>
          {user.login42}
        </div>
        <ButtonTxtViewProfile login={user.login42} />
        <ButtonTxtUserStatus login={user.login42} />
        <ButtonTxtBlockUser login={user.login42} />
      </div>
    );
  }
}

function UserList({ channel }: { channel: Channel }) {
  const sessionContext = useSessionContext();
  const [selectedUser, setSelectedUser] = useState<string>("");

  const getUserStyle = (userLogin: string) => {
    if (userLogin === channel?.owner) {
      return styles.owner;
    } else if (channel?.admin?.includes(userLogin)) {
      return styles.admins;
    } else {
      return styles.users;
    }
  };

  return channel?.users?.map((user) => {
    if (user.login42 === sessionContext.userSelf.login42) {
      return (
        <div key={user.login42} className={styles.connected_user}>
          <Avatar
            className={styles.chat_avatar}
            src={user.image}
            sx={{ width: "20px", height: "20px" }}
          >
            <Avatar
              className={styles.chat_avatar}
              src={user.photo42}
              sx={{ width: "20px", height: "20px" }}
            />
          </Avatar>
          {user.username}
        </div>
      );
    } else if (user.login42 === selectedUser) {
      return (
        <SelectedUserMenu
          key={user.login42}
          user={user}
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
          <Avatar
            className={styles.chat_avatar}
            src={user.image}
            sx={{ width: "20px", height: "20px" }}
          >
            <Avatar
              className={styles.chat_avatar}
              src={user.photo42}
              sx={{ width: "20px", height: "20px" }}
            />
          </Avatar>
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
        <Avatar
          src={channel.image}
          alt="channel image"
          sx={{
            width: 45,
            height: 45,
          }}
        >
          <Image
            src={channelImage}
            alt="channel image"
            width="45"
            height="45"
          />
        </Avatar>
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
      .getJoinedChannels(sessionContext.userSelf.login42)
      .then((currentChannels: Channel[]) => {
        setChannels(currentChannels);
      });
    socketContext.socket.on("update-channels-list", () => {
      channelService
        .getJoinedChannels(sessionContext.userSelf.login42)
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
