import styles from "../../styles/Home.module.css";
import userService from "../../services/user";
import { useSessionContext } from "../../context/SessionContext";
import { errorHandler } from "../../errors/errorHandler";
import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";
import { IUserSlim } from "../../interfaces/IUser";

export function ButtonCancelRequest({
  displayedUser,
}: {
  displayedUser: IUserSlim;
}) {
  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();

  const cancelRequest = async () => {
    await userService
      .cancelFriendRequest(
        sessionContext.userSelf.login42,
        displayedUser.login42
      )
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
        return;
      });

    socketContext.socket.emit("user:update-relations");
  };

  return (
    <button className={styles.add_friend_button} onClick={cancelRequest}>
      Cancel request
    </button>
  );
}
