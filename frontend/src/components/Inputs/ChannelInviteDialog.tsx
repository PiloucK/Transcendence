import React, { useState } from "react";
import styles from "../../styles/Home.module.css";

import { TextField } from "../Inputs/TextField";
import { PasswordField } from "../Inputs/PasswordField";
import { inputPFState } from "../../interfaces/inputPasswordField";

import Switch from "@mui/material/Switch";

import { ButtonChannelInvite } from "../Buttons/ButtonChannelInvite";
import { Channel, IUserForLeaderboard } from "../../interfaces/users";

import channelService from "../../services/channel";
import { useLoginContext } from "../../context/LoginContext";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { CardUserChannelInvite } from "../Cards/CardUserChannelInvite";

import { EmptyInvitableFriendList } from "../Social/emptyPages";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

function FriendList({
  friends,
  setSelectedFriends,
}: {
  friends: IUserForLeaderboard[];
  setSelectedFriends: (friends: IUserForLeaderboard) => void;
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
  friends: IUserForLeaderboard[];
  setSelectedFriends: (friends: IUserForLeaderboard) => void;
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
  const loginContext = useLoginContext();
  const [friends, setFriends] = useState<IUserForLeaderboard[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<IUserForLeaderboard[]>(
    []
  );

  React.useEffect(() => {
    channelService
      .getChannelInvitableFriends(loginContext.userLogin, channel.id)
      .then((friends: IUserForLeaderboard[]) => {
        setFriends(friends);
      });

    socket.on("update-channel-content", () => {
      channelService
        .getChannelInvitableFriends(loginContext.userLogin, channel.id)
        .then((friends: IUserForLeaderboard[]) => {
          setFriends(friends);
        });
    });
    socket.on("update-relations", () => {
      channelService
        .getChannelInvitableFriends(loginContext.userLogin, channel.id)
        .then((friends: IUserForLeaderboard[]) => {
          setFriends(friends);
        });
    });
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const addSelectedFriend = (friend: IUserForLeaderboard) => {
    if (
      selectedFriends.find(
        (f: IUserForLeaderboard) => f.login42 === friend.login42
      )
    ) {
      setSelectedFriends(
        selectedFriends.filter(
          (f: IUserForLeaderboard) => f.login42 !== friend.login42
        )
      );
    } else {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  const handleInvite = () => {
    setOpen(false);
    selectedFriends.forEach((friend: IUserForLeaderboard) => {
      channelService
        .inviteToChannel(loginContext.userLogin, channel.id, friend.login42)
        .then(socket.emit("user:update-channel-content"))
        .catch((err: Error) => {
          console.log(err);
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
