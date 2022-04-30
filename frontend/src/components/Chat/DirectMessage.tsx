import React, { useState } from "react";
import styles from "../../styles/Home.module.css";
import { EmptyFriendList } from "../Social/emptyPages";

import { DirectMessageMenu } from "./Menus";
import { useLoginContext } from "../../context/LoginContext";
import { IUserPublicInfos, DM, IMessage } from "../interfaces/users";
import userService from "../../services/users";
import { CardUserDM } from "../Cards/CardUserDM";

import Image from "next/image";
import Rocket from "../../public/no_dm_content.png";

import { SendMessageField } from "../Inputs/SendMessageField";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

function FriendList({
  friends,
  setMenu,
}: {
  friends: IUserPublicInfos[];
  setMenu: (menu: string) => void;
}) {
  if (typeof friends === "undefined" || friends.length === 0) {
    return <EmptyFriendList />;
  }

  return (
    <div className={styles.social_content}>
      {friends.map((friend) =>
        CardUserDM({ userInfos: friend, setMenu: setMenu })
      )}
    </div>
  );
}

function NewDirectMessage({ setMenu }: { setMenu: (menu: string) => void }) {
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
      <FriendList friends={friends} setMenu={setMenu} />
    </div>
  );
}

function Messages({ dm }: { dm: DM }) {
  const loginContext = useLoginContext();

  if (typeof dm === "undefined" || dm.messages.length === 0) {
    return (
      <div className={styles.social_empty_page}>
        <Image src={Rocket} />
        Be the first one to send a message !
      </div>
    );
  }

  const getStyle = (author: string) => {
    if (author === loginContext.userLogin) {
      return styles.message_author;
    } else {
      return styles.message_friend;
    }
  };

  return (
    <div className={styles.messages_area}>
      {dm.messages.map((message, index) => (
        <div className={getStyle(message.author)} key={index}>{message.content}</div>
      ))}
    </div>
  );
}

function CurrentDirectMessage({ menu }: { menu: string }) {
  const loginContext = useLoginContext();
  const [input, setInput] = React.useState("");
  const [dms, setDms] = useState<DM[]>();
  const users = menu.split("|");

  React.useEffect(() => {
    userService
      .getAllOpenedDM(loginContext.userLogin)
      .then((openedDMs: DM[]) => {
        setDms(openedDMs);
      });

    socket.on("update-direct-messages", () => {
      userService
        .getAllOpenedDM(loginContext.userLogin)
        .then((openedDMs: DM[]) => {
          setDms(openedDMs);
        });
    });
  }, []);

  const dm = dms?.find(
    (currDm:DM) =>
      (currDm.userOne.login42 === users[0] &&
        currDm.userTwo.login42 === users[1]) ||
      (currDm.userOne.login42 === users[1] &&
        currDm.userTwo.login42 === users[0])
  );
  return (
    <div className={styles.chat_direct_message_content}>
      <SendMessageField input={input} setInput={setInput} channel={menu} />
      <Messages dm={dm} />
    </div>
  );
}

function DirectMessageContent({
  menu,
  setMenu,
}: {
  menu: string;
  setMenu: (menu: string) => void;
}) {
  if (menu === "new_message") {
    return <NewDirectMessage setMenu={setMenu} />;
  }
  return <CurrentDirectMessage menu={menu} />;
}

export function DirectMessage() {
  const [menu, setMenu] = React.useState("new_message");

  return (
    <>
      <DirectMessageMenu menu={menu} setMenu={setMenu} />
      <DirectMessageContent menu={menu} setMenu={setMenu} />
    </>
  );
}
