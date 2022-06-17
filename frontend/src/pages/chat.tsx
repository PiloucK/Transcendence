import React from "react";

import { ChatMenu } from "../components/Chat/Menus";

import { DirectMessage } from "../components/Chat/DirectMessage";
import { AddChannel } from "../components/Chat/AddChannel";
import { Channel } from "../components/Chat/Channel";
import { useSessionContext } from "../context/SessionContext";
// import { DockGuest } from "../components/Dock/DockGuest";

function ChatContent({ menu }: { menu: string }) {
  if (menu === "direct_message") {
    return <DirectMessage />;
  } else if (menu === "add_channel") {
    return <AddChannel />;
  } else {
    return <Channel id={menu}/>;
  }
}

export default function Chat() {
	const sessionContext = useSessionContext();

  // if (sessionContext.userSelf.login42 === null) return <DockGuest />;
  return (
    <>
      <ChatMenu menu={sessionContext.chatMenu} setMenu={sessionContext.setChatMenu} />
      <ChatContent menu={sessionContext.chatMenu} />
    </>
  );
}
