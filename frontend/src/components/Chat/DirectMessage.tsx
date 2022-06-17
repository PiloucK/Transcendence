import React, { useState } from "react";
import styles from "../../styles/Home.module.css";
import { EmptyFriendList } from "../Social/emptyPages";

import { DirectMessageMenu } from "./Menus";
import { useSessionContext } from "../../context/SessionContext";
import {
  IUserPublic,
  PrivateConv,
  Message,
  Invitation,
} from "../../interfaces/IUser";
import userService from "../../services/user";
import privateConvService from "../../services/privateConv";
import { CardUserDM } from "../Cards/CardUserDM";

import Image from "next/image";
import Rocket from "../../public/no_dm_content.png";
import Blocked from "../../public/blocked.png";

import { SendMessageField } from "../Inputs/SendMessageField";

import { ButtonAcceptChannelInvite } from "../Buttons/ButtonAcceptChannelInvite";
import { useSocketContext } from "../../context/SocketContext";

function FriendList({
  friends,
  setMenu,
}: {
  friends: IUserPublic[];
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
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const [friends, setFriends] = useState<IUserPublic[]>([]);

  React.useEffect(() => {
    userService
      .getUserFriends(sessionContext.userLogin)
      .then((friends: IUserPublic[]) => {
        setFriends(friends);
      });

    socketContext.socket.on("update-leaderboard", () => {
      userService
        .getUserFriends(sessionContext.userLogin)
        .then((friends: IUserPublic[]) => {
          setFriends(friends);
        });
    });
    socketContext.socket.on("update-relations", () => {
      userService
        .getUserFriends(sessionContext.userLogin)
        .then((friends: IUserPublic[]) => {
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

function MessageContent({ message }: { message: Message | Invitation }) {
  if (typeof message.content === "string") {
    return <>{message.content}</>;
  } else {
    return (
      <div className={styles.message_system}>
        Hey! Join this channel!
        <ButtonAcceptChannelInvite channelId={message.channelId} />
      </div>
    );
  }
}

function Messages({ dm }: { dm: PrivateConv }) {
  const sessionContext = useSessionContext();

  if (typeof dm === "undefined" || dm.messages.length === 0) {
    return (
      <div className={styles.social_empty_page}>
        <Image src={Rocket} />
        Be the first one to send a message !
      </div>
    );
  }

  const getStyle = (author: string) => {
    if (author === sessionContext.userLogin) {
      return styles.message_author;
    } else {
      return styles.message_friend;
    }
  };

  if (typeof window !== "undefined") {
    var messageBody = document.querySelector("#directMessageMsgArea");
    if (messageBody) {
      messageBody.scrollTop =
        messageBody.scrollHeight - messageBody.clientHeight;
    }
  }
  return (
    <div className={styles.messages_area} id="directMessageMsgArea">
      {dm.messages.map((message, index) => (
        <div className={getStyle(message.author)} key={index}>
          <MessageContent message={message} />
        </div>
      ))}
    </div>
  );
}

function CurrentDirectMessage({ menu }: { menu: string }) {
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const [blockedList, setBlockedList] = React.useState<IUserPublic[]>([]);
  const [input, setInput] = React.useState("");
  const [privateConv, setPrivateConv] = useState<PrivateConv>();
  const users = menu.split("|");

  const friend = users[0] === sessionContext.userLogin ? users[1] : users[0];
  React.useEffect(() => {
    userService
      .getUserBlockedUsers(sessionContext.userLogin)
      .then((blocked: IUserPublic[]) => {
        setBlockedList(blocked);
      });
    privateConvService
      .getPrivateConv(sessionContext.userLogin, friend)
      .then((privateConv: PrivateConv) => {
        setPrivateConv(privateConv);
      });

    socketContext.socket.on("update-relations", () => {
      userService
        .getUserBlockedUsers(sessionContext.userLogin)
        .then((blocked: IUserPublic[]) => {
          setBlockedList(blocked);
        });
    });
    socketContext.socket.on("update-direct-messages", () => {
      privateConvService
        .getPrivateConv(sessionContext.userLogin, friend)
        .then((privateConv: PrivateConv) => {
          setPrivateConv(privateConv);
        });
    });
  }, [friend]);

  const blockedFriend = blockedList?.find(
    (blocked) => blocked.login42 === friend
  );
  if (blockedFriend) {
    return (
      <div className={styles.chat_direct_message_content}>
        <div className={styles.social_empty_page}>
          <Image src={Blocked} />
          {friend} is blocked and unable to annoy you anymore.
        </div>
      </div>
    );
  }
  return (
    <div className={styles.chat_direct_message_content}>
      <SendMessageField input={input} setInput={setInput} channel={menu} />
      <Messages dm={privateConv} />
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
  const sessionContext = useSessionContext();

  return (
    <>
      <DirectMessageMenu
        menu={sessionContext.chatDM}
        setMenu={sessionContext.setChatDM}
      />
      <DirectMessageContent
        menu={sessionContext.chatDM}
        setMenu={sessionContext.setChatDM}
      />
    </>
  );
}
