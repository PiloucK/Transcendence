import styles from "../../styles/Home.module.css";
import Router from "next/router";
import { IUserSlim } from "../../interfaces/IUser";
import { PrivateConv } from "../../interfaces/Chat.interfaces";
import privateConvService from "../../services/privateConv";
import { useSessionContext } from "../../context/SessionContext";
import { useSocketContext } from "../../context/SocketContext";
import { useErrorContext } from "../../context/ErrorContext";
import { errorHandler } from "../../errors/errorHandler";

export function ButtonSendPrivateConv({
  displayedUser,
}: {
  displayedUser: IUserSlim;
}) {
  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();

  const sendPrivateMessage = async () => {
    const privateConv: PrivateConv = await privateConvService
      .createPrivateConv(sessionContext.userSelf.login42, displayedUser.login42)
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
        return;
      });

    sessionContext.setChatDM?.(
      privateConv.userOne.login42 + "|" + privateConv.userTwo.login42
    );
    socketContext.socket.emit("user:update-direct-messages");
    Router.push("/chat");
  };

  return (
    <button className={styles.send_dm_button} onClick={sendPrivateMessage}>
      Send PrivateConv
    </button>
  );
}
