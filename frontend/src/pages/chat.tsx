import React from "react";
import styles from "../styles/Home.module.css";

import Image from "next/image";
import directMessage from "../public/direct_message.png";
import addChannel from "../public/add_channel.png";
import newMessageLogo from "../public/new_message_logo.png";
import Ghost from "../public/ghost.png";
import channelImage from "../public/channel_image.png"; //Temporary.

import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { EmptyFriendList } from "../components/Social/emptyPages";

interface State {
  amount: string;
  password: string;
  weight: string;
  weightRange: string;
  showPassword: boolean;
}

function DirectMessageMenu(props: {
  menu: string;
  setMenu: (menu: string) => void;
}) {
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
      {/* Put the map of current DM here */}
    </div>
  );
}

function NewDirectMessage() {
  return (
    <div className={styles.chat_direct_message_content}>
      Select a friend to start a conversation
      <EmptyFriendList />
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

function DirectMessage() {
  const [menu, setMenu] = React.useState("new_message");

  return (
    <>
      <DirectMessageMenu menu={menu} setMenu={setMenu} />
      <DirectMessageContent menu={menu} />
    </>
  );
}

function AddChannelMenu(props: {
  menu: string;
  setMenu: (menu: string) => void;
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
          props.setMenu("public_channels");
        }}
      >
        Public Channels
      </div>
      <div
        className={getStyle("create_channel")}
        onClick={() => {
          props.setMenu("create_channel");
        }}
      >
        Create Channel
      </div>
    </div>
  );
}

function EmptyPublicChannels() {
  return (
    <div className={styles.social_empty_page}>
      <Image src={Ghost} />
      Looks like there is no public channel. You should create yours!
    </div>
  );
}

function PublicChannels() {
  return <EmptyPublicChannels />;
}

function ButtonBrowse() {
  return <div className={styles.chat_create_channel_browse}>Browse</div>;
}

function InputPasswordField(props: {
  password: State;
  setPassword: (password: State) => void;
}) {
  const handlePasswordChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      props.setPassword({
        ...props.password,
        [prop]: event.target.value,
      });
    };

  const handleClickShowPassword = () => {
    props.setPassword({
      ...props.password,
      showPassword: !props.password.showPassword,
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <FormControl
      sx={{
        m: 1,
        width: "20ch",
        backgroundColor: "#E5E5E5",
        borderRadius: "10px",
      }}
      variant="outlined"
    >
      <InputLabel htmlFor="outlined-adornment-password">
        Empty for no password
      </InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={props.password.showPassword ? "text" : "password"}
        value={props.password.password}
        onChange={handlePasswordChange("password")}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {props.password.showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
      />
    </FormControl>
  );
}

function CreateChannelForm() {
  const [channelName, setChannelName] = React.useState("");
  const [channelPassword, setChannelPassword] = React.useState<State>({
    amount: "",
    password: "",
    weight: "",
    weightRange: "",
    showPassword: false,
  });
  const [confirmation, setConfirmation] = React.useState<State>({
    amount: "",
    password: "",
    weight: "",
    weightRange: "",
    showPassword: false,
  });
  const [isPrivate, setIsPrivate] = React.useState(false);

  const handleChannelNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setChannelName(event.target.value);
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPrivate(event.target.checked);
  };

  return (
    <div className={styles.chat_create_channel_form}>
      <div className={styles.chat_create_channel_form_input}>
        Channel Name
        <TextField
          sx={{
            m: 1,
            width: "20ch",
            backgroundColor: "#E5E5E5",
            borderRadius: "10px",
          }}
          value={channelName}
          onChange={handleChannelNameChange}
          label=""
        />
      </div>
      <div className={styles.chat_create_channel_form_input}>
        Channel Password
        <InputPasswordField
          password={channelPassword}
          setPassword={setChannelPassword}
        />
      </div>
      <div className={styles.chat_create_channel_form_input}>
        Confirm Password
        <InputPasswordField
          password={confirmation}
          setPassword={setConfirmation}
        />
      </div>
      <div className={styles.chat_create_channel_form_switch}>
        Set channel as private{" "}
        <Switch checked={isPrivate} onChange={handleSwitchChange} />
      </div>
      <div className={styles.chat_create_channel_form_create}>Create</div>
    </div>
  );
}

function CreateChannel() {
  return (
    <div className={styles.chat_create_channel}>
      <div className={styles.chat_create_channel_image}>
        <Image src={channelImage} alt="channel image" />
      </div>
      <ButtonBrowse />
      <CreateChannelForm />
    </div>
  );
}

function AddChannelContent({ menu }: { menu: string }) {
  if (menu === "public_channels") {
    return <PublicChannels />;
  } else if (menu === "create_channel") {
    return <CreateChannel />;
  } else {
    return null;
  }
}

function AddChannel() {
  const [menu, setMenu] = React.useState("public_channels");

  return (
    <div className={styles.chat_add_channel}>
      <AddChannelMenu menu={menu} setMenu={setMenu} />
      <AddChannelContent menu={menu} />
    </div>
  );
}

function ChatMenu(props: { menu: string; setMenu: (menu: string) => void }) {
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
          props.setMenu("direct_message");
        }}
      >
        <Image
          src={directMessage}
          alt="direct message"
          width={45}
          height={45}
        />
      </div>
      {/* Here should be a map of element for each server */}
      <div
        className={getStyle("add_channel")}
        onClick={() => {
          props.setMenu("add_channel");
        }}
      >
        <Image src={addChannel} alt="add channel" width={45} height={45} />
      </div>
    </div>
  );
}

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
