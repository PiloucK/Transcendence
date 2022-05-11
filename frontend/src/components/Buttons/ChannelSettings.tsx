import * as React from "react";
import IconButton from "@mui/material/IconButton";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import userService from "../../services/users";
import { Channel } from "../../interfaces/users";
import { useLoginContext } from "../../context/LoginContext";

import { ChannelSettingsDialog } from "../Inputs/ChannelSettingsDialog";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

function MenuButtons({
  channel,
  setAnchorEl,
}: {
  channel: Channel;
  setAnchorEl: (anchorEl: any) => void;
}) {
  const loginContext = useLoginContext();
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSettings = () => {
    setOpen(true);
  };

  const handleLeaveChannel = () => {
    loginContext.setChatMenu("direct_message");
    setAnchorEl(null);
    userService.leaveChannel(loginContext.userLogin, channel.id).then(() => {
      socket.emit("user:update-channel-content");
      socket.emit("user:update-joined-channel");
    });
  };

  if (loginContext.userLogin === channel.owner) {
    return (
      <>
        <MenuItem onClick={handleClose}>Invite friends</MenuItem>
        <MenuItem onClick={handleSettings}>Admin settings</MenuItem>
        <MenuItem onClick={handleLeaveChannel}>Leave channel</MenuItem>
        <ChannelSettingsDialog
          channel={channel}
          open={open}
          setOpen={setOpen}
        />
      </>
    );
  } else {
    return (
      <>
        <MenuItem onClick={handleLeaveChannel}>Leave channel</MenuItem>
        <ChannelSettingsDialog
          channel={channel}
          open={open}
          setOpen={setOpen}
        />
      </>
    );
  }
}

export default function ChannelSettings({ channel }: { channel: Channel }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        id="basic-button"
        color="info"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <ArrowCircleDownIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuButtons channel={channel} setAnchorEl={setAnchorEl} />
      </Menu>
    </div>
  );
}
