import React from "react";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";
import userService from "../../services/user";
import { IUserPublic } from "../../interfaces/IUser";

import Link from "next/link";

import Avatar from "@mui/material/Avatar";

import { UserGameHistory } from "./UserGameHistory";

import { ButtonAddFriend } from "../Buttons/ButtonAddFriend";
import { ButtonSendDM } from "../Buttons/ButtonSendDM";
import { ButtonRemoveFriend } from "../Buttons/ButtonRemoveFriend";
import { ButtonCancelRequest } from "../Buttons/ButtonCancelRequest";

import { ButtonUserStatus } from "../Buttons/ButtonUserStatus";
import { ButtonBlock } from "../Buttons/ButtonBlock";
import { ButtonUnblock } from "../Buttons/ButtonUnblock";

import { useSessionContext } from "../../context/SessionContext";

import { errorHandler } from "../../errors/errorHandler";

import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";

export function Interactions({ displayedUser }: { displayedUser: IUserPublic }) {
  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const [friendList, setFriendList] = React.useState<[]>([]);
  const [sentRList, setSentRList] = React.useState<[]>([]);
  const [blockedList, setBlockedList] = React.useState<[]>([]);

  React.useEffect(() => {
    userService
      .getUserFriends(sessionContext.userSelf.login42)
      .then((friends: IUserPublic[]) => {
        setFriendList(friends);
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });
    userService
      .getUserFriendRequestsSent(sessionContext.userSelf.login42)
      .then((requests: IUserPublic[]) => {
        setSentRList(requests);
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });
    userService
      .getUserBlockedUsers(sessionContext.userSelf.login42)
      .then((blocked: IUserPublic[]) => {
        setBlockedList(blocked);
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });

    socketContext.socket.on("update-relations", () => {
      userService
        .getUserFriends(sessionContext.userSelf.login42)
        .then((friends: IUserPublic[]) => {
          setFriendList(friends);
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
        });
      userService
        .getUserFriendRequestsSent(sessionContext.userSelf.login42)
        .then((requests: IUserPublic[]) => {
          setSentRList(requests);
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
        });
      userService
        .getUserBlockedUsers(sessionContext.userSelf.login42)
        .then((blocked: IUserPublic[]) => {
          setBlockedList(blocked);
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
        });
    });
  }, []);

  const friendButton = () => {
    if (
      friendList.find(
        (friend: IUserPublic) => friend.login42 === userInfos.login42
      )
    ) {
      return (
        <>
          <ButtonSendDM userInfos={userInfos} />
          <ButtonRemoveFriend userInfos={userInfos} />
        </>
      );
    } else if (
      sentRList.find(
        (friend: IUserPublic) => friend.login42 === userInfos.login42
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
        (blocked: IUserPublic) => blocked.login42 === userInfos.login42
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
    usrInfo: IUserPublic;
    setUsrInfo: (usrInfos: IUserPublic) => void;
  };
}) {
  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();

  React.useEffect(() => {
    socketContext.socket.on("update-leaderboard", () => {
      userService
        .getOne(state.usrInfo.username)
        .then((user: IUserPublic) => {
          state.setUsrInfo(user);
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
        });
    });
  }, []);

  return (
    <>
      <div className={styles.profile_user}>
        <AccountDetails userInfos={state.usrInfo} />
        <UserStats userInfos={state.usrInfo} />
        
      </div>
    </>
  );
}

export default function PublicProfile({ login }: { login: string }) {
  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();

  const [userInfos, setUserInfos] = React.useState<IUserPublic>({
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
