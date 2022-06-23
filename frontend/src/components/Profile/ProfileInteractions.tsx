import styles from "../../styles/Home.module.css";
import { IUserPublic, IUserSlim } from "../../interfaces/IUser";
import { ButtonAddFriend } from "../Buttons/ButtonAddFriend";
import { ButtonSendPrivateConv } from "../Buttons/ButtonSendPrivateConv";
import { ButtonRemoveFriend } from "../Buttons/ButtonRemoveFriend";
import { ButtonCancelRequest } from "../Buttons/ButtonCancelRequest";
import { ButtonUserStatus } from "../Buttons/ButtonUserStatus";
import { ButtonBlock } from "../Buttons/ButtonBlock";
import { ButtonUnblock } from "../Buttons/ButtonUnblock";
import { useSessionContext } from "../../context/SessionContext";
import { useSocketContext } from "../../context/SocketContext";
import { useEffect } from "react";

export function ProfileInteractions({
  displayedUser,
}: {
  displayedUser: IUserPublic;
}) {
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();

  useEffect(() => {
    socketContext.socket.on("update-relations", () => {
      sessionContext.updateUserSelf?.();
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
      <ButtonUserStatus displayedUser={displayedUser} />
      {friendButtons()}
      {blockButton()}
    </div>
  );
}
