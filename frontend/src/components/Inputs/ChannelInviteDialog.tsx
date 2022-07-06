import React, { useState } from "react";
import styles from "../../styles/Home.module.css";

import { ButtonChannelInvite } from "../Buttons/ButtonChannelInvite";
import { IUserSlim } from "../../interfaces/IUser";

import { Channel } from "../../interfaces/Chat.interfaces";

import channelService from "../../services/channel";
import { useSessionContext } from "../../context/SessionContext";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { CardUserChannelInvite } from "../Cards/CardUserChannelInvite";

import { EmptyInvitableFriendList } from "../Social/emptyPages";

import { errorHandler } from "../../errors/errorHandler";

import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";

function FriendList({
  friends,
  setSelectedFriends,
}: {
  friends: IUserSlim[];
  setSelectedFriends: (friends: IUserSlim) => void;
}) {
  return (
    <div className={styles.social_content}>
      {friends.map((friend) =>
        CardUserChannelInvite({ userInfos: friend, setSelectedFriends })
      )}
    </div>
  );
}

export function FriendContent({
  friends,
  setSelectedFriends,
}: {
  friends: IUserSlim[];
  setSelectedFriends: (friends: IUserSlim) => void;
}) {
  if (typeof friends === "undefined" || friends.length === 0) {
    return <EmptyInvitableFriendList />;
  } else {
    return (
      <FriendList friends={friends} setSelectedFriends={setSelectedFriends} />
    );
  }
}

export function ChannelInviteDialog({
  channel,
  open,
  setOpen,
}: {
  channel: Channel;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const [friends, setFriends] = useState<IUserSlim[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<IUserSlim[]>([]);

  React.useEffect(() => {
    if (typeof channel !== "undefined") {
      channelService
        .getChannelInvitableFriends(sessionContext.userSelf.login42, channel.id)
        .then((friends: IUserSlim[]) => {
          setFriends(friends);
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
        });
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const addSelectedFriend = (friend: IUserSlim) => {
    if (selectedFriends.find((f: IUserSlim) => f.login42 === friend.login42)) {
      setSelectedFriends(
        selectedFriends.filter((f: IUserSlim) => f.login42 !== friend.login42)
      );
    } else {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  const handleInvite = () => {
    setOpen(false);
    selectedFriends.forEach((friend: IUserSlim) => {
      channelService
        .inviteToChannel(
          sessionContext.userSelf.login42,
          channel.id,
          friend.login42
        )
        .then(() => {
          socketContext.socket.emit("user:update-direct-messages");
          socketContext.socket.emit("user:update-channel-content");
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
        });
    });
  };

  return (
    <div className={styles.channel_settings}>
      <Dialog
        PaperProps={{
          style: {
            backgroundColor: "#163F5B",
            width: "779px",
            minWidth: "779px",
            height: "657px",
            minHeight: "657px",
          },
        }}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Invite friends</DialogTitle>
        <DialogContent>
          <FriendContent
            friends={friends}
            setSelectedFriends={addSelectedFriend}
          />
        </DialogContent>
        <DialogActions>
          <ButtonChannelInvite invite={handleInvite} />
        </DialogActions>
      </Dialog>
    </div>
  );
}
