import * as React from "react";
import IconButton from "@mui/material/IconButton";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import channelService from "../../services/channel";
import { Channel } from "../../interfaces/Chat.interfaces";
import { useSessionContext } from "../../context/SessionContext";

import { ChannelSettingsDialog } from "../Inputs/ChannelSettingsDialog";
import { ChannelInviteDialog } from "../Inputs/ChannelInviteDialog";
import { useSocketContext } from "../../context/SocketContext";

function MenuButtons({
  channel,
  setAnchorEl,
}: {
  channel: Channel;
  setAnchorEl: (anchorEl: any) => void;
}) {
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [invitationOpen, setInvitationOpen] = React.useState(false);

  const handleInvitation = () => {
    setInvitationOpen(true);
  };

  const handleSettings = () => {
    setSettingsOpen(true);
  };

  const handleLeaveChannel = () => {
    sessionContext.setChatMenu?.("direct_message");
    setAnchorEl(null);
    channelService.leaveChannel(sessionContext.userLogin, channel.id).then(() => {
      socketContext.socket.emit("user:update-channel-content");
      socketContext.socket.emit("user:update-joined-channel");
    });
  };

  if (sessionContext.userLogin === channel.owner) {
    return (
      <>
        <MenuItem onClick={handleInvitation}>Invite friends</MenuItem>
        <MenuItem onClick={handleSettings}>Admin settings</MenuItem>
        <MenuItem onClick={handleLeaveChannel}>Leave channel</MenuItem>
        <ChannelSettingsDialog
          channel={channel}
          open={settingsOpen}
          setOpen={setSettingsOpen}
        />
        <ChannelInviteDialog
          channel={channel}
          open={invitationOpen}
          setOpen={setInvitationOpen}
        />
      </>
    );
  } else if (channel?.admins?.includes(sessionContext.userLogin)) {
    return (
      <>
        <MenuItem onClick={handleInvitation}>Invite friends</MenuItem>
        <MenuItem onClick={handleLeaveChannel}>Leave channel</MenuItem>
        <ChannelInviteDialog
          channel={channel}
          open={invitationOpen}
          setOpen={setInvitationOpen}
        />
      </>
    );
  } else {
    return (
      <>
        <MenuItem onClick={handleLeaveChannel}>Leave channel</MenuItem>
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
