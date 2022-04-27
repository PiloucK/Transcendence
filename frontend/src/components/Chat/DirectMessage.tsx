import React, { useState } from "react";
import styles from "../../styles/Home.module.css";
import { EmptyFriendList } from "../Social/emptyPages";

import { DirectMessageMenu } from "./Menus";
import { useLoginContext } from "../../context/LoginContext";
import { IUserPublicInfos } from "../interfaces/users";
import userService from "../../services/users";
import { CardUserNoInteractions } from "../Cards/CardUserNoInteractions";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

function FriendList({ friends }: { friends: IUserPublicInfos[] }) {
	if (typeof friends === "undefined" || friends.length === 0) {
		return <EmptyFriendList />;
	}

  return (
    <div className={styles.social_content}>
      {friends.map((friend) => CardUserNoInteractions({ userInfos: friend }))}
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

function DirectMessageContent({ menu }: { menu: string }) {
  if (menu === "new_message") {
    return <NewDirectMessage />;
  } else {
    return (
      <div className={styles.chat_direct_message_content}>DM with friend</div>
    );
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
