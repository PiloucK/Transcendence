import React from "react";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";
import userService from "../../services/users";
import { IUserPublicInfos } from "../../interfaces/users";

import Link from "next/link";

import io from "socket.io-client";

import Avatar from "@mui/material/Avatar";

import { UserGameHistory } from "./UserGameHistory";

import { ButtonAddFriend } from "../Buttons/ButtonAddFriend";
import { ButtonRemoveFriend } from "../Buttons/ButtonRemoveFriend";
import { ButtonCancelRequest } from "../Buttons/ButtonCancelRequest";

import { ButtonUserStatus } from "../Buttons/ButtonUserStatus";
import { ButtonBlock } from "../Buttons/ButtonBlock";
import { ButtonUnblock } from "../Buttons/ButtonUnblock";

import { useLoginContext } from "../../context/LoginContext";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

function UserName({ userInfos }: { userInfos: IUserPublicInfos }) {
  return (
    <div className={styles.profile_user_account_details_username}>
      {userInfos?.username}
    </div>
  );
}

function UserAvatar({ userInfos }: { userInfos: IUserPublicInfos }) {
  return (
    <div className={styles.profile_user_account_details_avatar}>
      <Avatar
        img="/public/profile_icon.png"
        alt="avatar"
        sx={{ width: 151, height: 151 }}
      />
    </div>
  );
}

function AccountDetails({ userInfos }: { userInfos: IUserPublicInfos }) {
  return (
    <div className={styles.profile_user_account_details}>
      <div className={styles.profile_user_account_details_title}>
        Account details
      </div>
      <UserAvatar userInfos={userInfos} />
      <UserName userInfos={userInfos} />
    </div>
  );
}

function UserStats({ userInfos }: { userInfos: IUserPublicInfos }) {
  return (
    <div className={styles.profile_user_stats}>
      <div className={styles.profile_user_stats_header}>
        <div className={styles.profile_user_stats_header_title}>Stats</div>
      </div>
      <div className={styles.profile_user_stats_elo}>Elo: {userInfos?.elo}</div>
      <div className={styles.profile_user_stats_games_summary}>
        Games won: {userInfos?.gamesWon}
        <br />
        Games lost: {userInfos?.gamesLost}
      </div>
    </div>
  );
}

function Interactions({ userInfos }: { userInfos: IUserPublicInfos }) {
  const loginContext = useLoginContext();
  const [friendList, setFriendList] = React.useState<[]>([]);
  const [sentRList, setSentRList] = React.useState<[]>([]);
  const [blockedList, setBlockedList] = React.useState<[]>([]);

  React.useEffect(() => {
    userService
      .getUserFriends(loginContext.userLogin)
      .then((friends: IUserPublicInfos[]) => {
        setFriendList(friends);
      });
    userService
      .getUserFriendRequestsSent(loginContext.userLogin)
      .then((requests: IUserPublicInfos[]) => {
        setSentRList(requests);
      });
    userService
      .getUserBlocked(loginContext.userLogin)
      .then((blocked: IUserPublicInfos[]) => {
        setBlockedList(blocked);
      });

    socket.on("update-relations", () => {
      userService
        .getUserFriends(loginContext.userLogin)
        .then((friends: IUserPublicInfos[]) => {
          setFriendList(friends);
        });
      userService
        .getUserFriendRequestsSent(loginContext.userLogin)
        .then((requests: IUserPublicInfos[]) => {
          setSentRList(requests);
        });
      userService
        .getUserBlocked(loginContext.userLogin)
        .then((blocked: IUserPublicInfos[]) => {
          setBlockedList(blocked);
        });
    });
  }, []);

  const friendButton = () => {
    if (
      friendList.find(
        (friend: IUserPublicInfos) => friend.login42 === userInfos.login42
      )
    ) {
      return <ButtonRemoveFriend userInfos={userInfos} />;
    } else if (
      sentRList.find(
        (friend: IUserPublicInfos) => friend.login42 === userInfos.login42
      )
    ) {
      return <ButtonCancelRequest userInfos={userInfos} />;
    } else {
      return <ButtonAddFriend userInfos={userInfos} />;
    }
  };

	const blockButton = () => {
		if (
			blockedList.find(
				(blocked: IUserPublicInfos) => blocked.login42 === userInfos.login42
			)
		) {
			return <ButtonUnblock userInfos={userInfos} />;
		} else {
			return <ButtonBlock userInfos={userInfos} />;
		}
	};

  return (
    <div className={styles.public_profile_buttons}>
      <ButtonUserStatus userInfos={userInfos} />
      {friendButton()}
      {blockButton()}
    </div>
  );
}

function Profile({
  state,
}: {
  state: {
    usrInfo: IUserPublicInfos;
    setUsrInfo: (usrInfos: IUserPublicInfos) => void;
  };
}) {
  React.useEffect(() => {
    socket.on("update-leaderboard", () => {
      userService
        .getOne(state.usrInfo.username)
        .then((user: IUserPublicInfos) => {
          state.setUsrInfo(user);
        });
    });
  }, []);

  return (
    <>
      <div className={styles.profile_user}>
        <AccountDetails userInfos={state.usrInfo} />
        <UserStats userInfos={state.usrInfo} />
        <Interactions userInfos={state.usrInfo} />
      </div>
      <UserGameHistory userLogin={state.usrInfo.login42} />
    </>
  );
}

export default function PublicProfile({ login }: { login: string }) {
  const [userInfos, setUserInfos] = React.useState<IUserPublicInfos>({
    login42: "",
    username: "",
    elo: 0,
    gamesWon: 0,
    gamesLost: 0,
  });

  if (
    login !== undefined &&
    userInfos !== undefined &&
    userInfos.username !== login
  ) {
    userService.getOne(login).then((user: IUserPublicInfos) => {
      setUserInfos(user);
    });
  }

  if (
    login !== undefined &&
    userInfos !== undefined &&
    userInfos.username !== undefined &&
    userInfos.username !== ""
  ) {
    return <Profile state={{ usrInfo: userInfos, setUsrInfo: setUserInfos }} />;
  } else {
    return <div>User not found</div>;
  }
}
