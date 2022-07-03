import styles from "../../styles/Home.module.css";
import { IUserSlim } from "../../interfaces/IUser";
import { useUserStatusContext } from "../../context/UserStatusContext";
import invitationService from "../../services/invitation";
import { defaultSessionState } from "../../constants/defaultSessionState";
import { useSessionContext } from "../../context/SessionContext";
import { errorHandler } from "../../errors/errorHandler";
import { useErrorContext } from "../../context/ErrorContext";
import { AxiosError } from "axios";
import { useSocketContext } from "../../context/SocketContext";
import { HttpStatusCodes } from "../../constants/httpStatusCodes";

export function ButtonUserStatus({
  displayedUser,
}: {
  displayedUser: IUserSlim;
}) {
  const userStatusContext = useUserStatusContext();
  const userStatus = userStatusContext.statuses.get(displayedUser.login42);
  const sessionContext = useSessionContext();
  const errorContext = useErrorContext();
  const socketContext = useSocketContext();

  const sendInvitation = () => {
    if (
      sessionContext.userSelf.login42 !== defaultSessionState.userSelf.login42
    ) {
      invitationService
        .sendInvitation(displayedUser.login42)
        .then(() => {
          socketContext.socket.emit("user:invitation-sent");
        })
        .catch((error: Error | AxiosError<unknown, any>) => {
          const parsedError = errorHandler(error, sessionContext);
          if (
            parsedError.statusCode === HttpStatusCodes.CONFLICT &&
            parsedError.message.startsWith(
              "The user is already invited to play."
            )
          ) {
            alert("The user is already invited to play.");
          } else {
            errorContext.newError?.(parsedError);
          }
        });
    }
  };

  if (userStatus?.status === "ONLINE" || userStatus?.status === "IN_QUEUE") {
    return (
      <div
        className={styles.social_friend_card_button}
        onClick={sendInvitation}
      >
        Defy
      </div>
    );
  } else if (userStatus?.status === "IN_GAME") {
    return (
      <div className={styles.social_friend_card_button} onClick={() => {}}>
        Spectate
      </div>
    );
  } else {
    return (
      <div className={styles.offline_button} onClick={() => {}}>
        Offline
      </div>
    );
  }
}
