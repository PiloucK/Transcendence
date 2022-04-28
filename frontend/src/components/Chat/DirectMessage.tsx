import React, { useState } from "react";
import styles from "../../styles/Home.module.css";
import { EmptyFriendList } from "../Social/emptyPages";

import { DirectMessageMenu } from "./Menus";
import { useLoginContext } from "../../context/LoginContext";
import { IUserPublicInfos } from "../interfaces/users";
import userService from "../../services/users";
import { CardUserDM } from "../Cards/CardUserDM";

import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import { SendMessageField } from "../Inputs/SendMessageField";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

function FriendList({ friends }: { friends: IUserPublicInfos[] }) {
  if (typeof friends === "undefined" || friends.length === 0) {
    return <EmptyFriendList />;
  }

  return (
    <div className={styles.social_content}>
      {friends.map((friend) => CardUserDM({ userInfos: friend }))}
    </div>
  );
}

function NewDirectMessage() {
  const loginContext = useLoginContext();
  const [friends, setFriends] = useState<IUserPublicInfos[]>([]);

  React.useEffect(() => {
    userService
      .getUserFriends(loginContext.userLogin)
      .then((friends: IUserPublicInfos[]) => {
        setFriends(friends);
      });

    socket.on("update-leaderboard", () => {
      userService
        .getUserFriends(loginContext.userLogin)
        .then((friends: IUserPublicInfos[]) => {
          setFriends(friends);
        });
    });
    socket.on("update-relations", () => {
      userService
        .getUserFriends(loginContext.userLogin)
        .then((friends: IUserPublicInfos[]) => {
          setFriends(friends);
        });
    });
  }, []);

  return (
    <div className={styles.chat_direct_message_content}>
      Select a friend to start a conversation
      <FriendList friends={friends} />
    </div>
  );
}

function CurrentDirectMessage({ menu }: { menu: string }) {
  const [input, setInput] = React.useState("");

  return (
    <div className={styles.chat_direct_message_content}>
      <div className={styles.chat_direct_message_content}>{menu}</div>
      <SendMessageField input={input} setInput={setInput} channel={menu} />
    </div>
  );
}

function DirectMessageContent({ menu }: { menu: string }) {
  if (menu === "new_message") {
    return <NewDirectMessage />;
  } else {
    return <CurrentDirectMessage menu={menu} />;
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
