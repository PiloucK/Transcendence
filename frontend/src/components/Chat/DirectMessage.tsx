import React, { useState } from "react";
import styles from "../../styles/Home.module.css";
import { EmptyFriendList } from "../Social/emptyPages";

import { DirectMessageMenu } from "./Menus";
import { useLoginContext } from "../../context/LoginContext";
import {
  IUserPublicInfos,
  PrivateConv,
  Message,
  Invitation,
} from "../../interfaces/users";
import userService from "../../services/user";
import privateConvService from "../../services/privateConv";
import { CardUserDM } from "../Cards/CardUserDM";

import Image from "next/image";
import Rocket from "../../public/no_dm_content.png";
import Blocked from "../../public/blocked.png";
import Avatar from "@mui/material/Avatar";

import { SendMessageField } from "../Inputs/SendMessageField";

import { ButtonAcceptChannelInvite } from "../Buttons/ButtonAcceptChannelInvite";

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

  const GetAvatar = ({ author }: { author: string }) => {
    if (author === loginContext.userLogin) {
      return null;
    } else {
      if (dm.userOne.username === author) {
        return (
          <div className={styles.chat_avatar}>
            <Avatar
              src={dm.userOne.photo42}
              sx={{ width: "40px", height: "40px" }}
            />
          </div>
        );
      } else {
        return (
          <div className={styles.chat_avatar}>
            <Avatar
              src={dm.userTwo.photo42}
              sx={{ width: "40px", height: "40px" }}
            />
          </div>
        );
      }
    }
  };

  const setScroll = () => {
    if (typeof window !== "undefined") {
      var messageBody = document.querySelector("#directMessageMsgArea");
      if (messageBody) {
        messageBody.scrollTop =
          messageBody.scrollHeight - messageBody.clientHeight;
      }
    }
  };

  React.useEffect(() => {
    setScroll();
  }, []);

  return (
    <div className={styles.messages_area} id="directMessageMsgArea">
      {dm.messages.map((message, index) => (
        <div className={getStyle(message.author)} key={index}>
          <MessageContent message={message} />
          <GetAvatar author={message.author} />
        </div>
      ))}
    </div>
  );
}

function CurrentDirectMessage({ menu }: { menu: string }) {
  const loginContext = useLoginContext();
  const [blockedList, setBlockedList] = React.useState<IUserPublicInfos[]>([]);
  const [input, setInput] = React.useState("");
  const [privateConv, setPrivateConv] = useState<PrivateConv>();
  const users = menu.split("|");

  const friend = users[0] === loginContext.userLogin ? users[1] : users[0];
  React.useEffect(() => {
    userService
      .getUserBlocked(loginContext.userLogin)
      .then((blocked: IUserPublicInfos[]) => {
        setBlockedList(blocked);
      });
    privateConvService
      .getPrivateConv(loginContext.userLogin, friend)
      .then((privateConv: PrivateConv) => {
        setPrivateConv(privateConv);
      });

    socket.on("update-relations", () => {
      userService
        .getUserBlocked(loginContext.userLogin)
        .then((blocked: IUserPublicInfos[]) => {
          setBlockedList(blocked);
        });
    });
    socket.on("update-direct-messages", () => {
      privateConvService
        .getPrivateConv(loginContext.userLogin, friend)
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
  const loginContext = useLoginContext();

  return (
    <>
      <DirectMessageMenu
        menu={loginContext.chatDM}
        setMenu={loginContext.setChatDM}
      />
      <DirectMessageContent
        menu={loginContext.chatDM}
        setMenu={loginContext.setChatDM}
      />
    </>
  );
}
