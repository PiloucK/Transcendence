import styles from "../../styles/Home.module.css";
import { IUserPublic, IUserSelf } from "../../interfaces/IUser";
import userService from "../../services/user";
import { useSessionContext } from "../../context/SessionContext";
import { errorHandler } from "../../errors/errorHandler";
import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";

export function ButtonCancelRequest({
  userSelf,
  displayedUser,
}: {
  userSelf: IUserSelf;
  displayedUser: IUserPublic;
}) {
  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();

  const cancelRequest = async () => {
    // if (
    //   sessionContext.userSelf.login42 !== null &&
    //   sessionContext.userSelf.login42 !== userInfos.login42
    // ) {
    await userService
      .cancelFriendRequest(userSelf.login42, displayedUser.login42)
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });
    socketContext.socket.emit("user:update-relations");
    // }
  };

  return (
    <button className={styles.add_friend_button} onClick={cancelRequest}>
      Cancel request
    </button>
  );
}
