import React from "react";

import { ChatMenu } from "../components/Chat/Menus";

import { DirectMessage } from "../components/Chat/DirectMessage";
import { AddChannel } from "../components/Chat/AddChannel";

function ChatContent({ menu }: { menu: string }) {
  if (menu === "direct_message") {
    return <DirectMessage />;
  } else if (menu === "add_channel") {
    return <AddChannel />;
  } else {
    return <div>Channel</div>;
  }
}

export default function Chat() {
  const [menu, setMenu] = React.useState("direct_message");

  return (
    <>
      <ChatMenu menu={menu} setMenu={setMenu} />
      <ChatContent menu={menu} />
    </>
  );
}
