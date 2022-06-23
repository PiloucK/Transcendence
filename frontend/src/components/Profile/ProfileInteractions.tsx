import styles from "../../styles/Home.module.css";
import userService from "../../services/user";
import { IUserPublic, IUserSelf, IUserSlim } from "../../interfaces/IUser";
import { ButtonAddFriend } from "../Buttons/ButtonAddFriend";
import { ButtonSendPrivateConv } from "../Buttons/ButtonSendPrivateConv";
import { ButtonRemoveFriend } from "../Buttons/ButtonRemoveFriend";
import { ButtonCancelRequest } from "../Buttons/ButtonCancelRequest";
import { ButtonUserStatus } from "../Buttons/ButtonUserStatus";
import { ButtonBlock } from "../Buttons/ButtonBlock";
import { ButtonUnblock } from "../Buttons/ButtonUnblock";
import { useSessionContext } from "../../context/SessionContext";
import { errorHandler } from "../../errors/errorHandler";
import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";
import { useEffect } from "react";
import { StatusMetrics } from "../../interfaces/status.types";

export function ProfileInteractions({
  displayedUser,
  userStatus,
}: {
  displayedUser: IUserPublic;
  userStatus: StatusMetrics | undefined;
}) {
  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();

  useEffect(() => {
    socketContext.socket.on("update-relations", () => {
      sessionContext.updateUserSelf?.();
      // userService
      //   .getUserFriends(sessionContext.userSelf.login42)
      //   .then((friends: IUserPublic[]) => {
      //     setFriendList(friends);
      //   })
      //   .catch((error) => {
      //     errorContext.newError?.(errorHandler(error, sessionContext));
      //   });
      // userService
      //   .getUserFriendRequestsSent(sessionContext.userSelf.login42)
      //   .then((requests: IUserPublic[]) => {
      //     setSentRList(requests);
      //   })
      //   .catch((error) => {
      //     errorContext.newError?.(errorHandler(error, sessionContext));
      //   });
      // userService
      //   .getUserBlockedUsers(sessionContext.userSelf.login42)
      //   .then((blocked: IUserPublic[]) => {
      //     setBlockedList(blocked);
      //   })
      //   .catch((error) => {
      //     errorContext.newError?.(errorHandler(error, sessionContext));
      //   });
    });
  }, []);

  const friendButtons = () => {
    if (
      sessionContext.userSelf.friends.find(
        (friend: IUserSlim) => friend.login42 === displayedUser.login42
      )
    ) {
      return (
        <>
          <ButtonSendPrivateConv displayedUser={displayedUser} />
          <ButtonRemoveFriend displayedUser={displayedUser} />
        </>
      );
    } else if (
      sessionContext.userSelf.friendRequestsSent.find(
        (friend: IUserSlim) => friend.login42 === displayedUser.login42
      )
    ) {
      return <ButtonCancelRequest displayedUser={displayedUser} />;
    } else {
      return <ButtonAddFriend displayedUser={displayedUser} />;
    }
  };

  const blockButton = () => {
    if (
      sessionContext.userSelf.blockedUsers.find(
        (blocked: IUserSlim) => blocked.login42 === displayedUser.login42
      )
    ) {
      return <ButtonUnblock displayedUser={displayedUser} />;
    } else {
      return <ButtonBlock displayedUser={displayedUser} />;
    }
  };

  return (
    <div className={styles.public_profile_buttons}>
      <ButtonUserStatus userStatus={userStatus} />
      {friendButtons()}
      {blockButton()}
    </div>
  );
}
