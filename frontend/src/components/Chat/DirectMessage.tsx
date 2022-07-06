import React, { useState } from "react";
import styles from "../../styles/Home.module.css";
import { EmptyFriendList } from "../Social/emptyPages";

import { DirectMessageMenu } from "./Menus";
import { errorHandler } from "../../errors/errorHandler";
import { useErrorContext } from "../../context/ErrorContext";
import { useSessionContext } from "../../context/SessionContext";
import {
  PrivateConv,
  Message,
  Invitation,
} from "../../interfaces/Chat.interfaces";

import privateConvService from "../../services/privateConv";
import { CardUserDM } from "../Cards/CardUserDM";

import Image from "next/image";
import Rocket from "../../public/no_dm_content.png";
import Blocked from "../../public/blocked.png";
import Avatar from "@mui/material/Avatar";

import { SendMessageField } from "../Inputs/SendMessageField";

import CircularProgress from "@mui/material/CircularProgress";
import { ButtonAcceptChannelInvite } from "../Buttons/ButtonAcceptChannelInvite";
import { useSocketContext } from "../../context/SocketContext";

function FriendList({ setMenu }: { setMenu: (menu: string) => void }) {
  const sessionContext = useSessionContext();

  if (sessionContext.userSelf.friends.length === 0) {
    return <EmptyFriendList />;
  }

  return (
    <div className={styles.social_content}>
      {sessionContext.userSelf.friends.map((friend) =>
        CardUserDM({ userInfos: friend, setMenu: setMenu })
      )}
    </div>
  );
}

function NewDirectMessage({ setMenu }: { setMenu: (menu: string) => void }) {
  return (
    <div className={styles.chat_direct_message_content}>
      Select a friend to start a conversation
      <FriendList setMenu={setMenu} />
    </div>
  );
}

function isMessage(
  toBeDetermined: Message | Invitation
): toBeDetermined is Message {
  if ((toBeDetermined as Message).content) {
    return true;
  }
  return false;
}

function MessageContent({ message }: { message: Message | Invitation }) {
  if (isMessage(message)) {
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

function Messages({ pc }: { pc: PrivateConv }) {
  const sessionContext = useSessionContext();

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
  }, [pc]);

  if (typeof pc === "undefined" || pc.messages.length === 0) {
    return (
      <div className={styles.social_empty_page}>
        <Image src={Rocket} />
        Be the first one to send a message !
      </div>
    );
  }

  const getStyle = (author: string) => {
    if (author === sessionContext.userSelf.login42) {
      return styles.message_author;
    } else {
      return styles.message_friend;
    }
  };

  const GetAvatar = ({ author }: { author: string }) => {
    if (author === sessionContext.userSelf.login42) {
      return null;
    } else {
      if (pc.userOne.login42 === author) {
        return (
          <div className={styles.chat_avatar}>
            <Avatar
              src={pc.userOne.image}
              sx={{ width: "40px", height: "40px" }}
            >
              <Avatar
                src={pc.userOne.photo42}
                sx={{ width: "40px", height: "40px" }}
              />
            </Avatar>
          </div>
        );
      } else {
        return (
          <div className={styles.chat_avatar}>
            <Avatar
              src={pc.userTwo.image}
              sx={{ width: "40px", height: "40px" }}
            >
              <Avatar
                src={pc.userTwo.photo42}
                sx={{ width: "40px", height: "40px" }}
              />
            </Avatar>
          </div>
        );
      }
    }
  };

  return (
    <div className={styles.messages_area} id="directMessageMsgArea">
      {pc.messages.map((message, index) => (
        <div className={getStyle(message.author)} key={index}>
          <MessageContent message={message} />
          <GetAvatar author={message.author} />
        </div>
      ))}
    </div>
  );
}

function CurrentDirectMessage({ menu }: { menu: string }) {
  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const [input, setInput] = React.useState("");
  const [privateConv, setPrivateConv] = useState<PrivateConv>();
  const users = menu.split("|");
  const friend =
    users[0] === sessionContext.userSelf.login42 ? users[1] : users[0];

  const fetchPrivateConv = () => {
    privateConvService
      .getPrivateConv(sessionContext.userSelf.login42, friend)
      .then((privateConv: PrivateConv) => {
        setPrivateConv(privateConv);
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });
  };

  React.useEffect(() => {
    fetchPrivateConv();
  }, [friend]);

  React.useEffect(() => {
    socketContext.socket.on("update-direct-messages", fetchPrivateConv);

    return () => {
      socketContext.socket.removeListener(
        "update-direct-messages",
        fetchPrivateConv
      );
    };
  }, []);

  const blockedFriend = sessionContext.userSelf.blockedUsers.find(
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
  if (typeof privateConv === "undefined") {
    return (
      <div className={styles.play}>
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className={styles.chat_direct_message_content}>
      <SendMessageField input={input} setInput={setInput} channel={menu} />
      <Messages pc={privateConv} />
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
